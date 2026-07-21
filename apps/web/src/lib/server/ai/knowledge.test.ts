import { describe, expect, it } from 'vitest';

import { createKnowledgeDocuments, getKnowledgeSections } from './knowledge';

describe('Ningki knowledge source', () => {
	it('memuat seluruh bagian inti dokumentasi', () => {
		const sections = getKnowledgeSections();

		expect(sections.length).toBeGreaterThanOrEqual(20);
		expect(sections.some((item) => item.title.includes('Owner WhatsApp Digest'))).toBe(true);
		expect(sections.some((item) => item.title.includes('Knowledge-Gap'))).toBe(true);
		expect(sections.some((item) => item.title.includes('Cara mulai'))).toBe(true);
	});

	it('menghasilkan chunk dengan metadata sumber dan id stabil', async () => {
		const documents = await createKnowledgeDocuments();

		expect(documents.length).toBeGreaterThanOrEqual(getKnowledgeSections().length);
		for (const document of documents) {
			expect(document.pageContent.length).toBeGreaterThan(20);
			expect(document.metadata.source).toBe('Ningki Reactive CRM — Dokumentasi Project Lengkap');
			expect(document.metadata.chunkId).toMatch(/^ningki-\d+$/);
		}
	});
});
