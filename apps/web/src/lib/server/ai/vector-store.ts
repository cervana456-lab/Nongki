import type { Document } from '@langchain/core/documents';
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';

import type { ChatSource } from '$lib/ai/types';
import { getAiConfig } from './config';
import { HuggingFaceRestEmbeddings } from './huggingface-embeddings';
import { createKnowledgeDocuments } from './knowledge';

let vectorStorePromise: Promise<MemoryVectorStore> | undefined;

async function initializeVectorStore(): Promise<MemoryVectorStore> {
	const config = getAiConfig();
	const embeddings = new HuggingFaceRestEmbeddings({
		token: config.hfToken,
		model: config.hfEmbeddingModel,
		batchSize: 16
	});
	const documents = await createKnowledgeDocuments();

	return MemoryVectorStore.fromDocuments(documents, embeddings);
}

export async function getVectorStore(): Promise<MemoryVectorStore> {
	if (!vectorStorePromise) {
		vectorStorePromise = initializeVectorStore().catch((error) => {
			vectorStorePromise = undefined;
			throw error;
		});
	}

	return vectorStorePromise;
}

export type RetrievedKnowledge = {
	context: string;
	documents: Document[];
	sources: ChatSource[];
};

export async function retrieveKnowledge(query: string, limit = 4): Promise<RetrievedKnowledge> {
	const vectorStore = await getVectorStore();
	const documents = await vectorStore.similaritySearch(query, limit);
	const uniqueSources = new Map<string, ChatSource>();

	for (const document of documents) {
		const title = String(document.metadata.title ?? 'Dokumentasi Ningki');
		const section = String(document.metadata.section ?? '-');
		uniqueSources.set(`${section}:${title}`, { title, section });
	}

	return {
		documents,
		sources: [...uniqueSources.values()],
		context: documents
			.map(
				(document) =>
					`[Bagian ${String(document.metadata.section)} — ${String(document.metadata.title)}]\n${document.pageContent}`
			)
			.join('\n\n---\n\n')
	};
}
