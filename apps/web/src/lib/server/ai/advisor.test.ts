import { describe, expect, it } from 'vitest';

import { analyzeAdvisorScenario, defaultAdvisorScenario } from './advisor';

describe('analyzeAdvisorScenario', () => {
	it('menghasilkan evidence deterministik untuk dataset demo', () => {
		const result = analyzeAdvisorScenario(defaultAdvisorScenario);

		expect(result.label).toContain('SIMULASI');
		expect(result.computed.conversionRate).toBe('25.0%');
		expect(result.computed.unconvertedChats).toBe(9);
		expect(result.evidence).toContain('3 dari 12 chat menjadi order (25.0%).');
	});

	it('menghindari pembagian nol', () => {
		const result = analyzeAdvisorScenario({
			totalChats: 0,
			totalOrders: 0,
			hotLeads: 0,
			atRiskCustomers: 0,
			nonCoffeeQuestions: 0
		});

		expect(result.computed.conversionRate).toBe('0.0%');
		expect(result.computed.unconvertedChats).toBe(0);
	});
});
