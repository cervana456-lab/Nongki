<script lang="ts">
	import { browser } from '$app/environment';
	import DOMPurify from 'dompurify';
	import { marked } from 'marked';

	let { content }: { content: string } = $props();

	function renderMarkdown(markdown: string): string {
		if (!browser) return '';
		const parsed = marked.parse(markdown, { async: false, breaks: true }) as string;
		const clean = DOMPurify.sanitize(parsed, {
			USE_PROFILES: { html: true },
			FORBID_TAGS: ['style', 'iframe', 'form', 'input', 'button']
		});
		const document = new DOMParser().parseFromString(clean, 'text/html');
		for (const link of document.querySelectorAll('a')) {
			link.setAttribute('target', '_blank');
			link.setAttribute('rel', 'noopener noreferrer');
		}
		return document.body.innerHTML;
	}

	const html = $derived(renderMarkdown(content));
</script>

<div class="ningki-markdown">{@html html}</div>

<style>
	.ningki-markdown :global(*) {
		max-width: 100%;
	}
	.ningki-markdown :global(p) {
		margin: 0.35rem 0;
		line-height: 1.65;
	}
	.ningki-markdown :global(p:first-child) {
		margin-top: 0;
	}
	.ningki-markdown :global(p:last-child) {
		margin-bottom: 0;
	}
	.ningki-markdown :global(h1),
	.ningki-markdown :global(h2),
	.ningki-markdown :global(h3) {
		margin: 0.75rem 0 0.35rem;
		font-family: var(--font-heading);
		font-weight: 700;
		line-height: 1.25;
	}
	.ningki-markdown :global(h1) {
		font-size: 1.05rem;
	}
	.ningki-markdown :global(h2),
	.ningki-markdown :global(h3) {
		font-size: 0.95rem;
	}
	.ningki-markdown :global(ul),
	.ningki-markdown :global(ol) {
		margin: 0.45rem 0;
		padding-left: 1.2rem;
	}
	.ningki-markdown :global(ul) {
		list-style: disc;
	}
	.ningki-markdown :global(ol) {
		list-style: decimal;
	}
	.ningki-markdown :global(li) {
		margin: 0.2rem 0;
	}
	.ningki-markdown :global(a) {
		color: var(--primary);
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.ningki-markdown :global(code) {
		border-radius: 0.4rem;
		background: color-mix(in oklab, var(--muted) 80%, transparent);
		padding: 0.1rem 0.3rem;
		font-size: 0.78rem;
	}
	.ningki-markdown :global(pre) {
		margin: 0.6rem 0;
		overflow-x: auto;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: var(--muted);
		padding: 0.75rem;
	}
	.ningki-markdown :global(pre code) {
		background: transparent;
		padding: 0;
	}
	.ningki-markdown :global(blockquote) {
		margin: 0.55rem 0;
		border-left: 3px solid var(--secondary);
		padding-left: 0.65rem;
		color: var(--muted-foreground);
	}
	.ningki-markdown :global(table) {
		width: 100%;
		margin: 0.6rem 0;
		border-collapse: collapse;
		font-size: 0.78rem;
	}
	.ningki-markdown :global(th),
	.ningki-markdown :global(td) {
		border: 1px solid var(--border);
		padding: 0.4rem;
		text-align: left;
	}
</style>
