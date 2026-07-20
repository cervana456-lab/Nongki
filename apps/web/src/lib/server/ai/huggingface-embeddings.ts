import { Embeddings } from '@langchain/core/embeddings';
import { InferenceClient } from '@huggingface/inference';

type HuggingFaceRestEmbeddingsOptions = {
	token: string;
	model: string;
	batchSize?: number;
};

function isNumberArray(value: unknown): value is number[] {
	return Array.isArray(value) && value.every((item) => typeof item === 'number');
}

function meanPool(matrix: number[][]): number[] {
	if (matrix.length === 0) throw new Error('Hugging Face mengembalikan embedding kosong');
	const dimensions = matrix[0]?.length ?? 0;
	if (dimensions === 0 || matrix.some((row) => row.length !== dimensions)) {
		throw new Error('Dimensi embedding Hugging Face tidak konsisten');
	}

	return Array.from({ length: dimensions }, (_, index) => {
		const total = matrix.reduce((sum, row) => sum + row[index], 0);
		return total / matrix.length;
	});
}

export function normalizeFeatureExtractionOutput(output: unknown, expected: number): number[][] {
	if (!Array.isArray(output) || output.length === 0) {
		throw new Error('Format embedding Hugging Face tidak valid');
	}

	if (expected === 1 && isNumberArray(output)) return [output];
	if (output.length !== expected) {
		if (expected === 1 && output.every(isNumberArray)) return [meanPool(output)];
		throw new Error(
			`Jumlah embedding tidak sesuai: diharapkan ${expected}, diterima ${output.length}`
		);
	}

	return output.map((item) => {
		if (isNumberArray(item)) return item;
		if (Array.isArray(item) && item.every(isNumberArray)) return meanPool(item);
		throw new Error('Vector embedding Hugging Face tidak valid');
	});
}

export class HuggingFaceRestEmbeddings extends Embeddings {
	private readonly client: InferenceClient;
	private readonly model: string;
	private readonly batchSize: number;

	constructor({ token, model, batchSize = 16 }: HuggingFaceRestEmbeddingsOptions) {
		super({ maxConcurrency: 2, maxRetries: 1 });
		this.client = new InferenceClient(token);
		this.model = model;
		this.batchSize = batchSize;
	}

	private async embedBatch(texts: string[]): Promise<number[][]> {
		const output = await this.caller.call(() =>
			this.client.featureExtraction({
				model: this.model,
				provider: 'hf-inference',
				inputs: texts,
				normalize: true,
				truncate: true,
				truncation_direction: 'right'
			})
		);

		return normalizeFeatureExtractionOutput(output, texts.length);
	}

	async embedDocuments(documents: string[]): Promise<number[][]> {
		const vectors: number[][] = [];
		for (let index = 0; index < documents.length; index += this.batchSize) {
			vectors.push(...(await this.embedBatch(documents.slice(index, index + this.batchSize))));
		}
		return vectors;
	}

	async embedQuery(document: string): Promise<number[]> {
		const [vector] = await this.embedBatch([document]);
		if (!vector) throw new Error('Hugging Face tidak mengembalikan query embedding');
		return vector;
	}
}
