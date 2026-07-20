import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

type KnowledgeSection = {
	section: string;
	title: string;
	category: string;
	content: string;
};

const sections: KnowledgeSection[] = [
	{
		section: '1',
		title: 'TL;DR dan positioning',
		category: 'overview',
		content: `Ningki Reactive CRM adalah sistem WhatsApp dan AI Agent untuk UMKM, terutama coffee shop dan F&B. Sistem mengubah chat pelanggan menjadi CRM aktif, insight bisnis, dan rekomendasi action yang dapat disetujui owner. Ningki bukan sekadar chatbot. Chatbot biasa pasif dan hanya menjawab, CRM biasa hanya menyimpan data, sedangkan Ningki menyimpan data, memahami pola, dan menyarankan action. Diferensiasi utamanya: "Bukan chatbot yang menjawab, tetapi CRM yang berinisiatif." Scope MVP adalah WA Agent, Customer 360 dan RFM, Reactive Insight, Owner WhatsApp Digest, Campaign Draft dengan approval, serta Knowledge-Gap Detector.`
	},
	{
		section: '2',
		title: 'Masalah yang diselesaikan',
		category: 'product',
		content: `UMKM F&B mengandalkan WhatsApp, tetapi chat pelanggan tersebar dan tidak terdokumentasi. Owner lupa follow-up, tidak tahu customer potensial atau at risk, tidak melihat menu yang paling sering ditanyakan, dan kehilangan order ketika pelanggan bertanya lalu menghilang. Inti masalahnya: UMKM kehilangan uang bukan karena tidak dapat membalas chat, melainkan karena tidak belajar apa pun dari chat tersebut.`
	},
	{
		section: '3-4',
		title: 'Solusi dan arsitektur besar',
		category: 'architecture',
		content: `Alur nilai Ningki: customer chat → data CRM → analitik → insight bisnis → rekomendasi action → owner approval → campaign atau follow-up → evaluasi hasil → sistem belajar lagi. Layer sistem terdiri dari Messaging Layer, API dan Orchestration, CRM Database, AI Agent, Feature dan Scoring, Reactive Insight, Business Advisor, Owner Dashboard, Owner WhatsApp Digest, Campaign Draft dan Approval, serta Action Execution.`
	},
	{
		section: '5',
		title: 'Messaging Layer',
		category: 'architecture',
		content: `WA Worker menerima dan menormalisasi chat WhatsApp, mengirim pesan ke API, mengelola session, dan mengirim reply kembali ke customer. WA Worker tidak boleh mengakses database secara langsung. Semua mutasi melewati API agar source of truth tetap tunggal, tenant isolation dengan businessId terjaga, transaksi konsisten, permission tidak dapat dilewati, dan semua perubahan dapat diaudit.`
	},
	{
		section: '6',
		title: 'API dan Orchestration Layer',
		category: 'architecture',
		content: `API adalah pusat mutasi data dan orkestrasi. API memvalidasi businessId, authentication dan permission, menjalankan transaksi database, memanggil AI Agent atau scoring bila perlu, lalu menyimpan hasilnya. Semua query wajib memuat businessId. Action penting disimpan pada agent_runs, tool_executions, dan audit log. Logic bisnis tidak boleh bocor ke worker atau frontend.`
	},
	{
		section: '7',
		title: 'CRM Core dan Customer 360',
		category: 'crm',
		content: `CRM Core menyimpan customer, conversation, message, order, reservation, customer tag, campaign, dan business insight. Customer 360 menggabungkan profil customer, nomor, first seen, last interaction, timeline chat inbound dan outbound, reply admin, riwayat order dan reservasi, segment, RFM score, lead score, churn flag, serta next best action.`
	},
	{
		section: '8',
		title: 'AI Agent Layer',
		category: 'ai',
		content: `AI Agent memuat business context, customer profile, conversation history, dan knowledge sebelum mengklasifikasikan intent. Agent dapat menjawab langsung atau memakai tools create_order, create_reservation, create_reminder, human_handoff, search_knowledge, dan create_knowledge_gap. Semua output melalui guardrail. Jika aman, reply dikirim; jika tidak yakin, agent meminta admin atau mencatat knowledge gap. MVP memakai LLM zero-shot untuk intent dan sentiment tanpa training IndoBERT.`
	},
	{
		section: '9',
		title: 'Feature, RFM, dan scoring',
		category: 'analytics',
		content: `Feature builder mengubah data mentah menjadi total_messages, total_orders, total_spent, average_order_value, days_since_last_chat, days_since_last_order, last_intent, favorite_product, complaint_count, dan promo_response_count. MVP menghitung RFM, lead score, churn flag, segment, dan campaign response dengan rule-based heuristic. Pendekatan ini tidak membutuhkan training data, explainable, dan cocok untuk cold-start.`
	},
	{
		section: '10',
		title: 'Reactive Insight',
		category: 'analytics',
		content: `Reactive Insight mendeteksi topic, lost order, customer risk, product demand, dan knowledge gap. Setiap insight wajib grounded pada evidence angka nyata, memiliki summary, recommendation, dan suggested action. Contohnya: 9 customer menanyakan menu non-coffee minggu ini; 5 customer bertanya harga tetapi tidak melanjutkan order; atau 3 repeat customer tidak aktif lebih dari 21 hari.`
	},
	{
		section: '11',
		title: 'Business Advisor dan Growth Card',
		category: 'advisor',
		content: `Business Advisor mengubah insight menjadi Growth Card tanpa mengeksekusi action otomatis. Growth Card berisi problem, evidence angka nyata, recommendation, suggested action, target customer, expected impact, risk, dan tombol Approve. Setelah owner review, action yang disetujui menjadi campaign draft atau follow-up task; yang ditolak tetap tersimpan sebagai insight.`
	},
	{
		section: '12',
		title: 'Owner WhatsApp Digest',
		category: 'product',
		content: `Owner WhatsApp Digest adalah fitur unggulan karena owner UMKM hampir selalu membuka WhatsApp. Daily schedule mengumpulkan metrics, hot leads, at risk customers, product trends, dan knowledge gaps. Contoh digest: 12 chat masuk, 3 menjadi order, 2 hot lead perlu follow-up, 1 repeat customer mulai tidak aktif, dan 9 orang menanyakan menu non-coffee. Owner dapat membalas untuk membuat follow-up draft, membuka campaign draft, atau menandai reviewed.`
	},
	{
		section: '13',
		title: 'Campaign Draft dan Approval',
		category: 'campaign',
		content: `Campaign tidak boleh auto-send massal. Insight memilih target segment, AI membuat copy, owner melakukan review dan edit, lalu compliance check memeriksa opt-in pelanggan, template yang disetujui Meta, 24-hour service window, approval owner, serta anti-spam frequency limit. Campaign baru dapat dijadwalkan atau dikirim setelah lolos seluruh pemeriksaan, kemudian hasilnya dilacak.`
	},
	{
		section: '14',
		title: 'Knowledge-Gap Detector',
		category: 'knowledge',
		content: `Jika pencarian knowledge tidak menemukan jawaban, sistem membuat knowledge gap, memberi notifikasi owner, menerima jawaban owner, memperbarui knowledge base, dan melakukan reindex. Dengan demikian pertanyaan nyata customer membuat bot semakin pintar dan owner tidak harus menulis FAQ lengkap sejak awal. Fitur ini mengatasi cold-start dan membuat knowledge self-improving.`
	},
	{
		section: '15',
		title: 'Lost Order Detector',
		category: 'analytics',
		content: `Lost order adalah customer yang menunjukkan buying intent tetapi tidak checkout, misalnya bertanya harga lalu diam, bertanya menu tanpa melanjutkan, atau meminta reservasi tanpa konfirmasi. MVP menganalisis last intent dan keberadaan order secara rule-based. Jika buying intent ada tetapi order tidak dibuat, sistem menandai lost opportunity dan menyarankan follow-up untuk disetujui owner.`
	},
	{
		section: '16',
		title: 'Dashboard UI',
		category: 'ui',
		content: `Dashboard Home menampilkan metrik harian, hot leads, at risk customer, dan saran tercepat. Inbox menyediakan conversation detail, suggested reply, dan human takeover. Customer 360 menampilkan profile, timeline, RFM, lead score, dan churn flag. Reactive Insights berisi top asked products, lost orders, at risk customers, dan knowledge gaps. Growth Cards menyediakan evidence dan approval. Campaign Center mengelola draft, audience, approval, dan result. AI Logs menampilkan agent runs, tool executions, dan audit trail.`
	},
	{
		section: '17-18',
		title: 'Scope MVP dan batasan',
		category: 'roadmap',
		content: `Core MVP terdiri dari WhatsApp AI Agent untuk FAQ, order, reservasi, dan handoff; Customer 360; RFM dan rule-based score; Reactive Insight; Owner WhatsApp Digest; Campaign Draft dan Approval; serta Knowledge-Gap Detector. Yang tidak dibangun dahulu: deep learning, fine-tuning IndoBERT, demand forecasting, collaborative filtering, matrix factorization, two-tower recommendation, multi-armed bandit, uplift modeling, causal inference, reinforcement learning, dan autonomous campaign auto-send.`
	},
	{
		section: '19',
		title: 'Roadmap machine learning',
		category: 'roadmap',
		content: `Roadmap bergerak berdasarkan kesiapan data: MVP rule-based, RFM, dan LLM zero-shot; lalu classical ML seperti logistic regression atau random forest; gradient boosting seperti LightGBM atau XGBoost; recommendation dan forecasting; experimentation dengan A/B test atau bandit; lalu autonomous growth. Lead atau churn ML memerlukan ratusan label, forecasting memerlukan minimal dua sampai tiga bulan transaksi bersih, dan recommendation memerlukan matriks customer-produk yang cukup.`
	},
	{
		section: '20',
		title: 'Data tambahan MVP',
		category: 'data',
		content: `Tabel ramping tambahan adalah customer_features, customer_scores, business_insights, campaigns, knowledge_gaps, dan owner_digests. Customer features menyimpan agregat interaksi dan transaksi. Customer scores menyimpan RFM, lead score, churn flag, segment, dan reasons. Insight menyimpan evidence dan recommendation. Campaign menyimpan target, draft, status, jadwal, dan result. Knowledge gap menyimpan question dan resolution. Semua tabel wajib memuat businessId untuk tenant isolation.`
	},
	{
		section: '21-22',
		title: 'Demo flow dan pitch',
		category: 'demo',
		content: `Demo 3–5 menit: customer chat bertanya menu, AI menjawab dan membuat order; Customer 360 memperbarui RFM, segment, dan lead score; Reactive Insight muncul dengan evidence; owner menerima WhatsApp Digest; owner membuka Growth Card; AI membuat campaign draft; owner approve; compliance check berjalan; Knowledge Gap menunjukkan sistem yang self-improving. Pitch: Ningki mengubah satu chat menjadi pemahaman hot lead, minat produk, lost order, follow-up, promo, dan knowledge gap.`
	},
	{
		section: '23',
		title: 'Risiko dan mitigasi',
		category: 'risk',
		content: `Risiko cold-start dimitigasi dengan rule-based, RFM, dan seed demo. Scope dikendalikan dengan fokus pada blok inti. WhatsApp compliance dijaga melalui opt-in, approval, dan template. Halusinasi dikurangi dengan grounding pada angka nyata. Biaya LLM dikendalikan lewat cache, batch, dan model murah. Kebocoran tenant dicegah dengan filter businessId. Campaign spam dicegah dengan approval, limit, dan opt-in.`
	},
	{
		section: '24',
		title: 'Kesimpulan produk',
		category: 'overview',
		content: `Ningki harus diposisikan sebagai Reactive CRM, bukan chatbot. MVP harus fokus. Owner WhatsApp Digest adalah fitur juara. Knowledge-Gap Detector melawan cold-start dan membuat sistem self-improving. Campaign Draft dan Approval mengubah insight menjadi action secara aman. ML berat hanya masuk roadmap setelah data cukup.`
	}
];

export function getKnowledgeSections(): KnowledgeSection[] {
	return sections;
}

export async function createKnowledgeDocuments(): Promise<Document[]> {
	const sourceDocuments = sections.map(
		(item) =>
			new Document({
				pageContent: `# ${item.title}\n\n${item.content}`,
				metadata: {
					section: item.section,
					title: item.title,
					category: item.category,
					source: 'Ningki Reactive CRM — Dokumentasi Project Lengkap'
				}
			})
	);

	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 900,
		chunkOverlap: 150,
		separators: ['\n## ', '\n### ', '\n\n', '. ', ' ']
	});
	const chunks = await splitter.splitDocuments(sourceDocuments);

	return chunks.map(
		(chunk, index) =>
			new Document({
				pageContent: chunk.pageContent,
				metadata: { ...chunk.metadata, chunkId: `ningki-${index + 1}` }
			})
	);
}
