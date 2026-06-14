import { buildCanonical } from '$lib/constants/seo';

export const prerender = true;

const routes = [
	'/',
	'/product',
	'/product/ai-agent',
	'/product/whatsapp-crm',
	'/product/customer-360',
	'/product/order-reservation',
	'/product/qris-payment',
	'/product/dashboard',
	'/solutions/coffee-shop',
	'/solutions/cafe-resto',
	'/solutions/umkm-fnb',
	'/pricing',
	'/docs'
];

export function GET() {
	const body = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
	.map(
		(route) => `	<url>
		<loc>${buildCanonical(route)}</loc>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
