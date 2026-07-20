import { randomUUID } from 'node:crypto';

import { json } from '@sveltejs/kit';
import { z } from 'zod';

import type { RequestHandler } from './$types';
import type { ChatStreamEvent } from '$lib/ai/types';
import { prepareAgentRun } from '$lib/server/ai/agent';
import { getAiConfig } from '$lib/server/ai/config';
import { checkChatRateLimit } from '$lib/server/ai/rate-limit';

export const config = { maxDuration: 60 };

const messageSchema = z.object({
	role: z.enum(['user', 'assistant']),
	content: z.string().trim().min(1).max(2_000)
});

const chatRequestSchema = z
	.object({
		sessionId: z.string().uuid(),
		mode: z.enum(['guide', 'advisor']),
		messages: z.array(messageSchema).min(1).max(12)
	})
	.superRefine((input, context) => {
		const totalCharacters = input.messages.reduce(
			(total, message) => total + message.content.length,
			0
		);
		if (totalCharacters > 12_000) {
			context.addIssue({
				code: 'custom',
				message: 'Total percakapan terlalu panjang',
				path: ['messages']
			});
		}
		if (input.messages.at(-1)?.role !== 'user') {
			context.addIssue({
				code: 'custom',
				message: 'Pesan terakhir harus berasal dari pengguna',
				path: ['messages']
			});
		}
	});

const encoder = new TextEncoder();

function encodeEvent(event: ChatStreamEvent): Uint8Array {
	return encoder.encode(`event: ${event.event}\ndata: ${JSON.stringify(event.data)}\n\n`);
}

function publicStreamError(error: unknown): Extract<ChatStreamEvent, { event: 'error' }>['data'] {
	const value = error as {
		status?: number;
		statusCode?: number;
		code?: string;
		name?: string;
		message?: string;
	};
	const status = value.status ?? value.statusCode;

	if (value.name === 'AbortError') {
		return { code: 'ABORTED', message: 'Permintaan dibatalkan.', retryable: true };
	}
	if (status === 401 || status === 403) {
		return {
			code: 'AI_AUTH_ERROR',
			message: 'Layanan AI belum dapat diautentikasi.',
			retryable: false
		};
	}
	if (status === 429) {
		return {
			code: 'AI_RATE_LIMITED',
			message: 'Layanan AI sedang sibuk. Coba lagi sebentar.',
			retryable: true
		};
	}
	if (value.code === 'ETIMEDOUT' || value.name === 'TimeoutError') {
		return {
			code: 'AI_TIMEOUT',
			message: 'Respons AI melewati batas waktu. Silakan coba lagi.',
			retryable: true
		};
	}

	return {
		code: 'AI_UNAVAILABLE',
		message: 'Ningki AI sedang tidak tersedia. Silakan coba lagi.',
		retryable: true
	};
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ message: 'Body request harus berupa JSON.' }, { status: 400 });
	}

	const parsed = chatRequestSchema.safeParse(body);
	if (!parsed.success) {
		return json(
			{ message: 'Request chat tidak valid.', issues: parsed.error.flatten().fieldErrors },
			{ status: 400 }
		);
	}

	try {
		getAiConfig();
	} catch {
		return json({ message: 'Konfigurasi Ningki AI belum lengkap.' }, { status: 503 });
	}

	let ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
	if (!ipAddress) {
		try {
			ipAddress = getClientAddress();
		} catch {
			ipAddress = 'unknown';
		}
	}

	let limitResult;
	try {
		limitResult = await checkChatRateLimit(ipAddress);
	} catch {
		return json({ message: 'Proteksi chat sedang tidak tersedia.' }, { status: 503 });
	}

	const rateHeaders = {
		'X-RateLimit-Limit': String(limitResult.limit),
		'X-RateLimit-Remaining': String(limitResult.remaining),
		'X-RateLimit-Reset': String(limitResult.reset)
	};

	if (!limitResult.success) {
		return json(
			{ message: 'Batas chat tercapai. Silakan coba lagi beberapa menit.' },
			{ status: 429, headers: rateHeaders }
		);
	}

	const requestId = randomUUID();
	const abortController = new AbortController();
	const timeoutId = setTimeout(() => abortController.abort(), 45_000);
	request.signal.addEventListener('abort', () => abortController.abort(), { once: true });

	const stream = new ReadableStream<Uint8Array>({
		async start(controller) {
			controller.enqueue(
				encodeEvent({ event: 'meta', data: { requestId, mode: parsed.data.mode } })
			);

			try {
				const run = await prepareAgentRun({
					mode: parsed.data.mode,
					messages: parsed.data.messages,
					signal: abortController.signal
				});

				for await (const token of run.tokens) {
					controller.enqueue(encodeEvent({ event: 'token', data: { content: token } }));
				}

				controller.enqueue(
					encodeEvent({
						event: 'sources',
						data: { sections: [...run.sources.values()] }
					})
				);
				controller.enqueue(encodeEvent({ event: 'done', data: { requestId } }));
			} catch (error) {
				if (!request.signal.aborted) {
					controller.enqueue(encodeEvent({ event: 'error', data: publicStreamError(error) }));
				}
			} finally {
				clearTimeout(timeoutId);
				controller.close();
			}
		},
		cancel() {
			clearTimeout(timeoutId);
			abortController.abort();
		}
	});

	return new Response(stream, {
		headers: {
			...rateHeaders,
			'Content-Type': 'text/event-stream; charset=utf-8',
			'Cache-Control': 'no-store, no-transform',
			Connection: 'keep-alive',
			'X-Accel-Buffering': 'no'
		}
	});
};
