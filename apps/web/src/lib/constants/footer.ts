// src/lib/constants/footer.ts

export const footerBrand = {
	name: 'Nongki',
	description:
		'AI WhatsApp CRM untuk membantu UMKM F&B mengubah chat pelanggan menjadi data, insight, dan action.',
	tagline: 'Chat → Data → Insight → Action'
};

export const footerCta = {
	title: 'Siap membuat WhatsApp bisnismu bekerja lebih pintar?',
	description: 'Mulai dari auto-reply, Customer 360, owner digest, sampai campaign approval.',
	primaryAction: {
		label: 'Mulai Gratis',
		href: '/auth/register'
	},
	secondaryAction: {
		label: 'Lihat Demo',
		href: '#cara-kerja'
	}
};

export const footerNavigationGroups = [
	{
		title: 'Produk',
		links: [
			{ label: 'WhatsApp CRM', href: '/product/whatsapp-crm' },
			{ label: 'AI Agent', href: '/product/ai-agent' },
			{ label: 'Customer 360', href: '/product/customer-360' },
			{ label: 'Order & Reservation', href: '/product/order-reservation' },
			{ label: 'QRIS Payment', href: '/product/qris-payment' },
			{ label: 'Owner Dashboard', href: '/product/dashboard' }
		]
	},
	{
		title: 'Solusi',
		links: [
			{ label: 'Coffee Shop', href: '/solutions/coffee-shop' },
			{ label: 'Cafe & Resto', href: '/solutions/cafe-resto' },
			{ label: 'UMKM F&B', href: '/solutions/umkm-fnb' }
		]
	},
	{
		title: 'Resource',
		links: [
			{ label: 'Docs', href: '/docs' },
			{ label: 'Harga', href: '/pricing' }
		]
	},
	{
		title: 'Auth',
		links: [
			{ label: 'Mulai Gratis', href: '/auth/register' },
			{ label: 'Masuk', href: '/auth/login' }
		]
	}
];

export const footerBottomLinks = [
	{ label: 'Docs', href: '/docs' },
	{ label: 'Harga', href: '/pricing' },
	{ label: 'Masuk', href: '/auth/login' }
];

export const footerPills = ['WhatsApp-first', 'F&B CRM', 'Owner Digest'];
