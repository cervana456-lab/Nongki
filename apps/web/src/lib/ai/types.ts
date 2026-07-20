export type ChatMode = 'guide' | 'advisor';

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
	id: string;
	role: ChatRole;
	content: string;
};

export type ChatRequest = {
	sessionId: string;
	mode: ChatMode;
	messages: Array<Pick<ChatMessage, 'role' | 'content'>>;
};

export type ChatSource = {
	title: string;
	section: string;
};

export type ChatStreamEvent =
	| { event: 'meta'; data: { requestId: string; mode: ChatMode } }
	| { event: 'token'; data: { content: string } }
	| { event: 'sources'; data: { sections: ChatSource[] } }
	| { event: 'done'; data: { requestId: string } }
	| {
			event: 'error';
			data: { code: string; message: string; retryable: boolean };
	  };
