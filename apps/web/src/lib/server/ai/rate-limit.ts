import { createHash } from 'node:crypto';

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { getAiConfig } from './config';

type RateLimitResult = {
	success: boolean;
	limit: number;
	remaining: number;
	reset: number;
};

let rateLimiter: Ratelimit | undefined;
const memoryWindows = new Map<string, number[]>();
const limit = 15;
const windowMs = 10 * 60_000;

function getRateLimiter(): Ratelimit | undefined {
	if (rateLimiter) return rateLimiter;

	const config = getAiConfig();
	if (!config.upstashUrl && !config.upstashToken) return undefined;
	if (!config.upstashUrl || !config.upstashToken) {
		throw new Error('Konfigurasi Upstash harus menyertakan URL dan token');
	}

	const redis = new Redis({
		url: config.upstashUrl,
		token: config.upstashToken
	});

	rateLimiter = new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(15, '10 m'),
		prefix: 'nongki:web:chat',
		analytics: false,
		timeout: 15_000
	});

	return rateLimiter;
}

function checkMemoryRateLimit(identifier: string): RateLimitResult {
	const now = Date.now();
	const activeRequests = (memoryWindows.get(identifier) ?? []).filter(
		(timestamp) => timestamp > now - windowMs
	);
	const success = activeRequests.length < limit;
	if (success) activeRequests.push(now);
	if (activeRequests.length > 0) memoryWindows.set(identifier, activeRequests);

	return {
		success,
		limit,
		remaining: Math.max(0, limit - activeRequests.length),
		reset: (activeRequests[0] ?? now) + windowMs
	};
}

export async function checkChatRateLimit(ipAddress: string): Promise<RateLimitResult> {
	const identifier = createHash('sha256').update(ipAddress).digest('hex').slice(0, 32);
	const limiter = getRateLimiter();
	return limiter ? limiter.limit(identifier) : checkMemoryRateLimit(identifier);
}
