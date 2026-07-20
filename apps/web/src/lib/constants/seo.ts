export const seoConfig = {
	siteName: 'Nongki',
	siteUrl: 'https://nongki.app',
	defaultTitle: 'Nongki - AI WhatsApp CRM untuk UMKM F&B',
	defaultDescription:
		'Nongki membantu coffee shop, kafe, dan resto mengubah chat WhatsApp menjadi Customer 360, insight bisnis, order, QRIS, owner digest, dan action otomatis.',
	defaultOgImage: '/og-image.png',
	locale: 'id_ID',
	twitterCard: 'summary_large_image'
} as const;

export const routeSeo = {
	'/': {
		title: 'Nongki - AI WhatsApp CRM untuk UMKM F&B',
		description: seoConfig.defaultDescription
	},
	'/product': {
		title: 'Produk Nongki - AI WhatsApp CRM, Customer 360, QRIS, dan Owner Dashboard',
		description:
			'Lihat modul produk Nongki untuk mengelola chat WhatsApp, AI Agent, Customer 360, order/reservasi, QRIS Payment, dan dashboard owner untuk UMKM F&B.'
	},
	'/pricing': {
		title: 'Harga Nongki',
		description:
			'Mulai gratis dengan Nongki, gunakan kredit AI pay-as-you-go, dan upgrade ke Pro saat bisnis butuh multi-outlet.'
	},
	'/docs': {
		title: 'Docs Nongki',
		description:
			'Dokumentasi Nongki untuk WhatsApp CRM, AI Agent, Customer 360, QRIS Payment, owner digest, dan workflow UMKM F&B.'
	},
	'/auth/login': {
		title: 'Masuk ke Nongki',
		description: 'Masuk ke workspace demo Nongki untuk mengelola chat, customer, order, dan digest.'
	},
	'/auth/register': {
		title: 'Daftar Nongki',
		description: 'Buat akun Nongki dan mulai siapkan workspace demo untuk bisnis F&B kamu.'
	},
	'/dashboard': {
		title: 'Dashboard Nongki',
		description: 'Dashboard demo Nongki untuk melihat ringkasan chat, customer, order, dan digest.'
	},
	'/settings': {
		title: 'Settings Nongki',
		description: 'Pengaturan demo workspace Nongki.'
	}
} as const;

export function buildPageTitle(title?: string) {
	if (!title || title === seoConfig.defaultTitle) return seoConfig.defaultTitle;

	return `${title} | ${seoConfig.siteName}`;
}

export function buildCanonical(pathname = '/') {
	const cleanPath = pathname === '/' ? '' : pathname.replace(/\/$/, '');

	return `${seoConfig.siteUrl}${cleanPath}`;
}

export function truncateDescription(description: string) {
	if (description.length <= 160) return description;

	return `${description.slice(0, 157).trimEnd()}...`;
}
