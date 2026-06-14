import {
	FileText,
	Inbox,
	MessageCircle,
	QrCode,
	Sparkles,
	TrendingUp,
	UserCheck,
	Users,
	Workflow
} from '@lucide/svelte';

export type VisualType =
	| 'chat'
	| 'bot'
	| 'profile'
	| 'chart'
	| 'campaign'
	| 'knowledge'
	| 'payment'
	| 'digest'
	| 'approval'
	| 'order';

export const heroOverview = {
	eyebrow: 'WhatsApp CRM untuk UMKM F&B',
	title: {
		before: 'Ubah chat WhatsApp jadi',
		highlight: 'insight bisnis',
		after: ' dan action otomatis.'
	},
	description:
		'Ningki membantu coffee shop, kafe, dan resto membalas chat pelanggan, mencatat Customer 360, mendeteksi hot lead, menemukan lost order, dan mengirim ringkasan bisnis langsung ke WhatsApp owner.',
	actions: [
		{
			label: 'Coba Sekarang',
			href: '/auth/register',
			variant: 'primary'
		},
		{
			label: 'Lihat Cara Kerja',
			href: '#cara-kerja',
			variant: 'outline'
		}
	],
	productLink: {
		label: 'Lihat produk',
		href: '/product'
	},
	metrics: [
		{ label: 'Chat', value: '12' },
		{ label: 'Order', value: '3' },
		{ label: 'Hot lead', value: '2' }
	],
	floatingPills: ['Hot lead detected', 'QRIS ready', 'Customer 360 updated']
};

export const problemOverview = {
	eyebrow: 'Masalah yang sering terjadi',
	title: 'Chat ramai, tapi peluang bisnis sering lewat begitu saja.',
	description:
		'Banyak UMKM F&B sudah aktif di WhatsApp. Pelanggan bertanya menu, harga, promo, reservasi, dan komplain setiap hari. Masalahnya, setelah chat dibalas, data pentingnya sering tidak tercatat.',
	punchline:
		'Masalahnya bukan kurang chat. Masalahnya, chat belum berubah menjadi data dan action.',
	cta: {
		label: 'Lihat bagaimana Nongki bekerja',
		href: '#cara-kerja'
	},
	inbox: {
		title: 'Inbox WhatsApp Hari Ini',
		footer: '5 sinyal bisnis, belum jadi action.',
		items: [
			{ message: 'Kak menu non-coffee ada?', status: 'belum dianalisis' },
			{ message: 'Bisa reservasi jam 7?', status: 'belum masuk CRM' },
			{ message: 'Harga paket ulang tahun?', status: 'perlu follow-up' },
			{ message: 'Promo hari ini apa?', status: 'pertanyaan berulang' },
			{ message: 'Kak tadi belum checkout', status: 'lost order' }
		]
	},
	cards: [
		{
			title: 'Follow-up terlewat',
			description: 'Customer sudah tanya harga, tapi tidak ada reminder untuk menghubungi lagi.',
			icon: UserCheck
		},
		{
			title: 'Data pelanggan tercecer',
			description: 'Minat, riwayat chat, dan order tidak otomatis menjadi profil pelanggan.',
			icon: Users
		},
		{
			title: 'Pola produk tidak terbaca',
			description: 'Menu yang sering ditanya tidak terlihat sebagai insight bisnis.',
			icon: TrendingUp
		},
		{
			title: 'Owner tetap manual',
			description: 'Owner harus membaca chat satu per satu untuk tahu kondisi harian.',
			icon: Inbox
		}
	]
};

export const stickyStorySection = {
	eyebrow: 'Cara kerja',
	title: 'Dari satu chat, Nongki membangun satu loop bisnis.',
	description:
		'Setiap pesan pelanggan bisa menjadi balasan, data pelanggan, insight, dan rekomendasi action. Landing page ini menampilkan gambaran besarnya, sementara detail modul tersedia di halaman produk.',
	cta: {
		label: 'Lihat produk lengkap',
		href: '/product'
	},
	points: [
		'Chat dipahami AI',
		'Customer 360 diperbarui',
		'Insight dikirim ke owner',
		'Action menunggu approval'
	],
	items: [
		{
			title: 'Customer mulai dari WhatsApp',
			description:
				'Pelanggan bertanya menu, promo, order, reservasi, atau komplain dari kanal yang sudah mereka pakai.',
			href: '/product/whatsapp-crm',
			linkLabel: 'Detail WhatsApp CRM',
			visualType: 'chat' as VisualType
		},
		{
			title: 'Ningki membalas sesuai knowledge bisnis',
			description:
				'AI menjawab dengan tone brand dan knowledge base UMKM, bukan jawaban template generik.',
			href: '/product/ai-agent',
			linkLabel: 'Detail AI reply',
			visualType: 'bot' as VisualType
		},
		{
			title: 'Data masuk ke Customer 360',
			description: 'Minat pelanggan, histori chat, order, dan status lead diperbarui otomatis.',
			href: '/product/customer-360',
			linkLabel: 'Detail Customer 360',
			visualType: 'profile' as VisualType
		},
		{
			title: 'Order dan QRIS bisa dibuat',
			description:
				'Jika pelanggan lanjut order atau reservasi, sistem dapat membuat record dan menghubungkannya dengan pembayaran QRIS.',
			href: '/product/qris-payment',
			linkLabel: 'Detail QRIS payment',
			visualType: 'payment' as VisualType
		},
		{
			title: 'Owner menerima digest',
			description:
				'Ringkasan harian dikirim ke WhatsApp owner agar tidak harus terus membuka dashboard.',
			href: '/product/dashboard',
			linkLabel: 'Detail owner dashboard',
			visualType: 'digest' as VisualType
		},
		{
			title: 'Action tetap butuh approval',
			description:
				'Follow-up dan campaign bisa dibuat AI, tetapi pengiriman tetap menunggu keputusan owner.',
			href: '/product/dashboard',
			linkLabel: 'Detail owner dashboard',
			visualType: 'approval' as VisualType
		}
	]
};

export const featurePreview = {
	title: 'Fitur inti yang saling terhubung.',
	description:
		'Setiap fitur Nongki dibuat untuk satu alur yang sama: chat masuk, data terbentuk, insight muncul, lalu owner mengambil action.',
	cta: {
		label: 'Lihat semua produk',
		href: '/product'
	},
	items: [
		{
			title: 'Owner WhatsApp Digest',
			description: 'Ringkasan harian dikirim langsung ke WhatsApp owner.',
			href: '/product/dashboard',
			icon: MessageCircle,
			visualType: 'digest' as VisualType,
			layout: 'digest'
		},
		{
			title: 'WhatsApp AI Agent',
			description: 'Balas FAQ, bantu order/reservasi, dan alihkan ke human saat perlu.',
			href: '/product/ai-agent',
			icon: Sparkles,
			visualType: 'chat' as VisualType,
			layout: 'agent'
		},
		{
			title: 'Customer 360',
			description: 'Profil pelanggan terbentuk otomatis dari chat dan transaksi.',
			href: '/product/customer-360',
			icon: Users,
			visualType: 'profile' as VisualType,
			layout: 'small'
		},
		{
			title: 'Reactive Insight',
			description:
				'Lihat sinyal bisnis seperti produk ramai ditanya, hot lead, dan customer at-risk.',
			href: '/product/dashboard',
			icon: TrendingUp,
			visualType: 'chart' as VisualType,
			layout: 'small'
		},
		{
			title: 'Campaign Draft',
			description: 'AI menyiapkan draft follow-up atau campaign berdasarkan insight.',
			href: '/product/dashboard',
			icon: Workflow,
			visualType: 'campaign' as VisualType,
			layout: 'small'
		},
		{
			title: 'Knowledge Gap',
			description: 'Pertanyaan yang belum bisa dijawab disimpan agar knowledge base makin lengkap.',
			href: '/docs',
			icon: FileText,
			visualType: 'knowledge' as VisualType,
			layout: 'wide'
		},
		{
			title: 'Order & QRIS Flow',
			description: 'Order dari chat bisa diteruskan ke pembayaran QRIS dan status paid.',
			href: '/product/qris-payment',
			icon: QrCode,
			visualType: 'payment' as VisualType,
			layout: 'wide'
		}
	]
};

export const ownerDigestPreview = {
	eyebrow: 'Owner WhatsApp Digest',
	title: 'Owner tidak perlu buka dashboard setiap saat.',
	description:
		'Ningki bisa mengirim ringkasan harian langsung ke WhatsApp owner: chat masuk, hot lead, customer at-risk, produk yang ramai ditanya, dan rekomendasi action.',
	cta: {
		label: 'Lihat dashboard owner',
		href: '/product/dashboard'
	},
	benefits: [
		'Tetap update dari WhatsApp',
		'Hot lead langsung terlihat',
		'Rekomendasi action lebih cepat',
		'Owner tetap approve sebelum dikirim'
	],
	pills: ['2 hot lead', 'Digest ready', 'Reply “1” to draft']
};

export const pricingPreview = {
	title: 'Mulai gratis, lalu bayar sesuai pemakaian AI.',
	description:
		'Nongki memakai model hybrid: Starter gratis untuk mencoba CRM dasar, kredit AI untuk fitur berbasis AI, dan Pro untuk bisnis yang butuh multi-outlet.',
	detail: {
		label: 'Lihat detail harga',
		href: '/pricing'
	},
	items: [
		{
			title: 'Starter',
			label: 'Free',
			description: 'Untuk bisnis kecil yang ingin mencoba CRM dasar tanpa biaya awal.',
			features: [
				'Gratis',
				'CRM dasar',
				'Customer 360 dasar',
				'AI reply terbatas',
				'1 nomor WhatsApp'
			],
			cta: 'Mulai Gratis',
			href: '/auth/register'
		},
		{
			title: 'Kredit AI',
			label: 'Pay-as-you-go',
			description: 'Untuk fitur AI yang lebih aktif dengan biaya yang tetap dikontrol owner.',
			features: [
				'Bayar sesuai pemakaian',
				'AI reply tambahan',
				'Reactive insight',
				'Owner digest',
				'Campaign draft',
				'Top-up via AstraPay QRIS'
			],
			cta: 'Lihat Kredit AI',
			href: '/pricing',
			highlight: true,
			badge: 'Monetisasi utama'
		},
		{
			title: 'Pro',
			label: 'Opsional',
			description: 'Untuk multi-outlet, kuota lebih besar, dan fitur operasional lanjutan.',
			features: [
				'Coming soon',
				'Multi-outlet',
				'Kuota lebih besar',
				'Advanced analytics',
				'Priority support'
			],
			cta: 'Diskusi Pro',
			href: '/auth/register'
		}
	]
};
