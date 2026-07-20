import type { ChatRequest, ChatStreamEvent } from './types';

type StreamHandlers = {
	onEvent: (event: ChatStreamEvent) => void;
	signal: AbortSignal;
};

function parseEventBlock(block: string): ChatStreamEvent | undefined {
	let eventName = '';
	let data = '';

	for (const line of block.split('\n')) {
		if (line.startsWith('event:')) eventName = line.slice(6).trim();
		if (line.startsWith('data:')) data += line.slice(5).trim();
	}

	if (!eventName || !data) return undefined;

	try {
		return { event: eventName, data: JSON.parse(data) } as ChatStreamEvent;
	} catch {
		return undefined;
	}
}

export async function streamChat(
	payload: ChatRequest,
	{ onEvent, signal }: StreamHandlers
): Promise<void> {
	const response = await fetch('/api/chat', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
		signal
	});

	if (!response.ok) {
		const body = (await response.json().catch(() => null)) as { message?: string } | null;
		throw new Error(body?.message ?? 'Ningki AI gagal merespons.');
	}
	if (!response.body) throw new Error('Browser tidak mendukung streaming response.');

	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = '';

	while (true) {
		const { value, done } = await reader.read();
		buffer += decoder.decode(value, { stream: !done }).replace(/\r\n/g, '\n');
		const blocks = buffer.split('\n\n');
		buffer = blocks.pop() ?? '';

		for (const block of blocks) {
			const event = parseEventBlock(block);
			if (event) onEvent(event);
		}

		if (done) break;
	}

	if (buffer.trim()) {
		const event = parseEventBlock(buffer);
		if (event) onEvent(event);
	}
}
