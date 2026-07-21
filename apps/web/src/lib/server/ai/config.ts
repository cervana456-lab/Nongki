import { env } from '$env/dynamic/private';
import { z } from 'zod';

const configSchema = z.object({
	FLAZ_BASE_URL: z.string().url().default('https://ai.flaz.id/v1'),
	FLAZ_API_KEY: z.string().min(1, 'FLAZ_API_KEY belum dikonfigurasi'),
	LLM_MODEL: z.string().min(1).default('MiniMax-M2.7-highspeed'),
	HF_TOKEN: z.string().min(1, 'HF_TOKEN belum dikonfigurasi'),
	HF_EMBEDDING_MODEL: z
		.string()
		.min(1)
		.default('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2'),
	UPSTASH_REDIS_REST_URL: z.string().url().optional(),
	UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional()
});

export type AiConfig = {
	baseUrl: string;
	apiKey: string;
	model: string;
	hfToken: string;
	hfEmbeddingModel: string;
	upstashUrl?: string;
	upstashToken?: string;
};

let cachedConfig: AiConfig | undefined;

export function getAiConfig(): AiConfig {
	if (cachedConfig) return cachedConfig;

	const parsed = configSchema.parse(env);
	cachedConfig = {
		baseUrl: parsed.FLAZ_BASE_URL.replace(/\/$/, ''),
		apiKey: parsed.FLAZ_API_KEY,
		model: parsed.LLM_MODEL,
		hfToken: parsed.HF_TOKEN,
		hfEmbeddingModel: parsed.HF_EMBEDDING_MODEL,
		upstashUrl: parsed.UPSTASH_REDIS_REST_URL,
		upstashToken: parsed.UPSTASH_REDIS_REST_TOKEN
	};

	return cachedConfig;
}
