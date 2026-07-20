<script lang="ts">
	import { tick } from 'svelte';
	import {
		BookOpen,
		ChartNoAxesCombined,
		RotateCcw,
		Send,
		Sparkles,
		Square,
		X
	} from '@lucide/svelte';

	import { streamChat } from '$lib/ai/chat-client';
	import type { ChatMessage, ChatMode, ChatSource, ChatStreamEvent } from '$lib/ai/types';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Textarea } from '$lib/components/ui/textarea';
	import CoffeeRobot from './CoffeeRobot.svelte';
	import MarkdownMessage from './MarkdownMessage.svelte';

	type UiMessage = ChatMessage & { sources?: ChatSource[]; failed?: boolean };

	const suggestedPrompts: Record<ChatMode, string[]> = {
		guide: [
			'Apa bedanya Ningki dengan chatbot biasa?',
			'Jelaskan fitur Owner WhatsApp Digest',
			'Apa saja scope MVP Ningki?'
		],
		advisor: [
			'Analisis dataset demo dan buat Growth Card',
			'Buat draft follow-up untuk 2 hot lead',
			'Apa peluang dari 9 pertanyaan menu non-coffee?'
		]
	};

	let open = $state(false);
	let wasOpen = false;
	let mode = $state<ChatMode>('guide');
	let input = $state('');
	let messages = $state<UiMessage[]>([]);
	let streaming = $state(false);
	let streamController = $state<AbortController>();
	let sessionId = $state('');
	let messageList = $state<HTMLDivElement>();
	let textarea = $state<HTMLTextAreaElement>();

	const greeting = (currentMode: ChatMode): UiMessage => ({
		id: crypto.randomUUID(),
		role: 'assistant',
		content:
			currentMode === 'guide'
				? 'Halo! Aku **Ningki AI** ☕\n\nTanyakan fitur, arsitektur, atau rencana MVP Ningki Reactive CRM.'
				: 'Halo! Mode **Simulasi CRM Advisor** aktif. ☕\n\nAku memakai dataset demo dan akan menandai semua insight sebagai simulasi.'
	});

	function startSession() {
		sessionId = crypto.randomUUID();
		messages = [greeting(mode)];
		input = '';
	}

	function resetConversation() {
		streamController?.abort();
		streamController = undefined;
		streaming = false;
		messages = [];
		input = '';
		sessionId = '';
		mode = 'guide';
	}

	$effect(() => {
		if (open && !wasOpen) startSession();
		if (!open && wasOpen) resetConversation();
		wasOpen = open;
	});

	$effect(() => {
		messages.length;
		messages.at(-1)?.content;
		tick().then(() => {
			if (messageList) messageList.scrollTop = messageList.scrollHeight;
		});
	});

	function selectMode(nextMode: ChatMode) {
		if (mode === nextMode || streaming) return;
		mode = nextMode;
		messages = [greeting(nextMode)];
		input = '';
	}

	function handleEvent(event: ChatStreamEvent, assistant: UiMessage) {
		if (event.event === 'token') assistant.content += event.data.content;
		if (event.event === 'sources') assistant.sources = event.data.sections;
		if (event.event === 'error') {
			assistant.failed = true;
			assistant.content ||= event.data.message;
		}
	}

	async function sendMessage(text = input) {
		const content = text.trim();
		if (!content || streaming || !sessionId) return;

		const userMessage: UiMessage = { id: crypto.randomUUID(), role: 'user', content };
		messages.push(userMessage);
		input = '';
		if (textarea) textarea.style.height = 'auto';

		const history = messages
			.filter((message) => message.content.trim())
			.slice(-12)
			.map(({ role, content: messageContent }) => ({ role, content: messageContent }));
		const assistant: UiMessage = { id: crypto.randomUUID(), role: 'assistant', content: '' };
		messages.push(assistant);
		streaming = true;
		streamController = new AbortController();

		try {
			await streamChat(
				{ sessionId, mode, messages: history },
				{ signal: streamController.signal, onEvent: (event) => handleEvent(event, assistant) }
			);
		} catch (error) {
			if ((error as Error).name !== 'AbortError') {
				assistant.failed = true;
				assistant.content ||= (error as Error).message;
			}
		} finally {
			streaming = false;
			streamController = undefined;
		}
	}

	function stopStreaming() {
		streamController?.abort();
		streamController = undefined;
		streaming = false;
	}

	function retryLast() {
		if (streaming) return;
		const failedIndex = messages.findLastIndex(
			(message) => message.role === 'assistant' && message.failed
		);
		if (failedIndex < 1) return;
		const previous = messages[failedIndex - 1];
		if (previous.role !== 'user') return;
		messages.splice(failedIndex - 1, 2);
		void sendMessage(previous.content);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			void sendMessage();
		}
	}

	function resizeTextarea() {
		if (!textarea) return;
		textarea.style.height = 'auto';
		textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class="group fixed right-4 bottom-4 z-[60] grid size-16 place-items-center rounded-3xl border-2 border-primary bg-background text-primary shadow-[0_7px_0_0_var(--shadow-3d-primary)] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:translate-y-1 active:shadow-[0_2px_0_0_var(--shadow-3d-primary)] sm:right-6 sm:bottom-6"
		aria-label="Buka Ningki AI"
	>
		<CoffeeRobot
			class="size-13 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
		/>
		<span
			class="absolute -top-1 -right-1 size-4 rounded-full border-2 border-background bg-emerald-500"
			><span class="sr-only">Ningki AI online</span></span
		>
	</Dialog.Trigger>

	<Dialog.Content
		showCloseButton={false}
		class="top-auto right-0 bottom-0 left-0 z-[70] flex h-[min(720px,calc(100dvh-1rem))] max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-b-none border-2 p-0 sm:right-6 sm:bottom-6 sm:left-auto sm:h-[min(680px,calc(100dvh-3rem))] sm:w-[410px] sm:max-w-[calc(100vw-3rem)] sm:rounded-3xl"
	>
		<Dialog.Title class="sr-only">Ningki AI Chat</Dialog.Title>
		<Dialog.Description class="sr-only"
			>Tanya produk Ningki atau coba simulasi Reactive CRM Advisor.</Dialog.Description
		>

		<header class="shrink-0 border-b bg-primary/8 px-4 pt-4 pb-3">
			<div class="flex items-center gap-3">
				<div
					class="shadow-3d-sm grid size-11 shrink-0 place-items-center rounded-2xl border-2 border-primary bg-background text-primary"
				>
					<CoffeeRobot class="size-9" />
				</div>
				<div class="min-w-0 flex-1">
					<h2 class="truncate text-base font-bold">Ningki AI</h2>
					<p class="flex items-center gap-1.5 text-xs text-muted-foreground">
						<span class="size-2 rounded-full bg-emerald-500"></span>Reactive CRM companion
					</p>
				</div>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="Tutup dan reset chat"
					onclick={() => (open = false)}><X class="size-4" /></Button
				>
			</div>

			<div class="mt-3 grid grid-cols-2 rounded-2xl border-2 bg-background p-1">
				<button
					type="button"
					class="flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-bold transition-colors"
					class:bg-primary={mode === 'guide'}
					class:text-primary-foreground={mode === 'guide'}
					class:text-muted-foreground={mode !== 'guide'}
					disabled={streaming}
					onclick={() => selectMode('guide')}
				>
					<BookOpen class="size-3.5" /> Tanya Ningki
				</button>
				<button
					type="button"
					class="flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-bold transition-colors"
					class:bg-secondary={mode === 'advisor'}
					class:text-secondary-foreground={mode === 'advisor'}
					class:text-muted-foreground={mode !== 'advisor'}
					disabled={streaming}
					onclick={() => selectMode('advisor')}
				>
					<ChartNoAxesCombined class="size-3.5" /> Simulasi Advisor
				</button>
			</div>
		</header>

		<div
			bind:this={messageList}
			class="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4"
			aria-live="polite"
		>
			{#each messages as message (message.id)}
				<div class:justify-end={message.role === 'user'} class="flex gap-2">
					{#if message.role === 'assistant'}<div
							class="mt-1 grid size-7 shrink-0 place-items-center rounded-xl border bg-background text-primary"
						>
							<CoffeeRobot class="size-6" />
						</div>{/if}
					<div class="max-w-[84%]">
						{#if message.role === 'assistant' && mode === 'advisor'}<span
								class="mb-1 inline-flex items-center gap-1 rounded-full bg-secondary/25 px-2 py-0.5 text-[10px] font-bold text-secondary-foreground"
								><Sparkles class="size-3" /> SIMULASI</span
							>{/if}
						<div
							class="rounded-2xl border-2 px-3.5 py-2.5 text-sm"
							class:border-primary={message.role === 'user'}
							class:bg-primary={message.role === 'user'}
							class:text-primary-foreground={message.role === 'user'}
							class:bg-card={message.role === 'assistant'}
							class:border-destructive={message.failed}
						>
							{#if message.role === 'assistant'}
								{#if !message.content && streaming}
									<div class="flex gap-1 py-1" aria-label="Ningki sedang berpikir">
										<span
											class="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]"
										></span><span
											class="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]"
										></span><span class="size-2 animate-bounce rounded-full bg-primary"></span>
									</div>
								{:else}<MarkdownMessage content={message.content} />{/if}
							{:else}<p class="leading-relaxed whitespace-pre-wrap">{message.content}</p>{/if}
						</div>

						{#if message.sources?.length}
							<div class="mt-2 flex flex-wrap gap-1.5">
								{#each message.sources as source (`${source.section}-${source.title}`)}<span
										class="rounded-full border bg-muted/70 px-2 py-1 text-[10px] font-semibold text-muted-foreground"
										title={source.title}>§{source.section} {source.title}</span
									>{/each}
							</div>
						{/if}
						{#if message.failed}<button
								type="button"
								class="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
								onclick={retryLast}><RotateCcw class="size-3" /> Coba lagi</button
							>{/if}
					</div>
				</div>
			{/each}
		</div>

		{#if messages.length <= 1}
			<div class="shrink-0 px-4 pb-3">
				<p class="mb-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
					Coba tanyakan
				</p>
				<div class="flex flex-wrap gap-2">
					{#each suggestedPrompts[mode] as prompt}<button
							type="button"
							class="rounded-xl border bg-background px-2.5 py-1.5 text-left text-xs font-semibold transition-colors hover:border-primary hover:bg-primary/5"
							onclick={() => void sendMessage(prompt)}>{prompt}</button
						>{/each}
				</div>
			</div>
		{/if}

		<footer class="shrink-0 border-t bg-background p-3">
			<div class="flex items-end gap-2">
				<Textarea
					bind:ref={textarea}
					bind:value={input}
					rows={1}
					maxlength={2000}
					placeholder={mode === 'guide' ? 'Tanya tentang Ningki…' : 'Ceritakan skenario bisnis…'}
					class="max-h-28 min-h-11 resize-none py-2.5 shadow-none"
					disabled={streaming}
					oninput={resizeTextarea}
					onkeydown={handleKeydown}
				/>
				{#if streaming}
					<Button
						variant="destructive"
						size="icon"
						aria-label="Hentikan jawaban"
						onclick={stopStreaming}><Square class="size-4 fill-current" /></Button
					>
				{:else}
					<Button
						size="icon"
						aria-label="Kirim pesan"
						disabled={!input.trim()}
						onclick={() => void sendMessage()}><Send class="size-4" /></Button
					>
				{/if}
			</div>
			<p class="mt-2 text-center text-[10px] text-muted-foreground">
				AI dapat keliru. Verifikasi rekomendasi penting.
			</p>
		</footer>
	</Dialog.Content>
</Dialog.Root>
