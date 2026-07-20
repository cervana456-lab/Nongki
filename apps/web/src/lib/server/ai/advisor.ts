import { z } from 'zod';

export const advisorScenarioSchema = z.object({
	totalChats: z.number().int().min(0).default(12),
	totalOrders: z.number().int().min(0).default(3),
	hotLeads: z.number().int().min(0).default(2),
	atRiskCustomers: z.number().int().min(0).default(1),
	nonCoffeeQuestions: z.number().int().min(0).default(9)
});

export type AdvisorScenario = z.infer<typeof advisorScenarioSchema>;

export const defaultAdvisorScenario: AdvisorScenario = {
	totalChats: 12,
	totalOrders: 3,
	hotLeads: 2,
	atRiskCustomers: 1,
	nonCoffeeQuestions: 9
};

export function analyzeAdvisorScenario(input: AdvisorScenario) {
	const scenario = advisorScenarioSchema.parse(input);
	const conversionRate =
		scenario.totalChats === 0 ? 0 : (scenario.totalOrders / scenario.totalChats) * 100;
	const unconvertedChats = Math.max(0, scenario.totalChats - scenario.totalOrders);

	return {
		label: 'SIMULASI — bukan data CRM nyata',
		metrics: scenario,
		computed: {
			conversionRate: `${conversionRate.toFixed(1)}%`,
			unconvertedChats
		},
		evidence: [
			`${scenario.totalOrders} dari ${scenario.totalChats} chat menjadi order (${conversionRate.toFixed(1)}%).`,
			`${scenario.hotLeads} hot lead membutuhkan prioritas follow-up.`,
			`${scenario.atRiskCustomers} customer terdeteksi mulai tidak aktif.`,
			`${scenario.nonCoffeeQuestions} pertanyaan tentang menu non-coffee menunjukkan demand.`
		],
		guardrail:
			'Buat rekomendasi atau draft saja. Jangan mengklaim telah mengirim pesan, membuat campaign, atau mengubah CRM.'
	};
}
