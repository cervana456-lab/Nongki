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

function getRateLimiter(): Ratelimit {
	if (rateLimiter) return rateLimiter;

	const config = getAiConfig();
	const redis = new Redis({
		url: config.upstashUrl,
		token: config.upstashToken
	});

	rateLimiter = new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(15, '10 m'),
		prefix: 'nongki:web:chat',
		analytics: false
	});

	return rateLimiter;
}

export async function checkChatRateLimit(ipAddress: string): Promise<RateLimitResult> {
	const identifier = createHash('sha256').update(ipAddress).digest('hex').slice(0, 32);
	return getRateLimiter().limit(identifier);
}
