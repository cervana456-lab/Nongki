import { describe, expect, it } from 'vitest';

import { normalizeFeatureExtractionOutput } from './huggingface-embeddings';

describe('normalizeFeatureExtractionOutput', () => {
	it('menerima vector tunggal dari REST API', () => {
		expect(normalizeFeatureExtractionOutput([0.1, 0.2, 0.3], 1)).toEqual([[0.1, 0.2, 0.3]]);
	});

	it('menerima batch vector', () => {
		expect(
			normalizeFeatureExtractionOutput(
				[
					[0.1, 0.2],
					[0.3, 0.4]
				],
				2
			)
		).toEqual([
			[0.1, 0.2],
			[0.3, 0.4]
		]);
	});

	it('melakukan mean pooling bila provider mengembalikan token vectors', () => {
		expect(
			normalizeFeatureExtractionOutput(
				[
					[
						[1, 3],
						[3, 5]
					]
				],
				1
			)
		).toEqual([[2, 4]]);
	});
});
