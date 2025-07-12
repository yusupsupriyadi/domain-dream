import { describe, expect, it, mock } from 'bun:test';
import { Elysia } from 'elysia';

// Mock domain checker sebelum import
mock.module('@/lib/domain-checker', () => ({
	DomainChecker: class {
		async checkKeywordTLDs(name: string, tlds?: string[]) {
			const actualTlds = tlds || ['com', 'id', 'org'];
			return {
				keyword: name,
				totalChecked: actualTlds.length,
				availableDomains: [`${name}.com`],
				results: actualTlds.map((tld) => ({
					domain: `${name}.${tld}`,
					available: tld === 'com',
				})),
			};
		}
	},
}));

// Import setelah mock
import { health } from '@/app/api/[[...slugs]]/modules/health';
import { domains } from '@/app/api/[[...slugs]]/modules/domains';

describe('API Integration', () => {
	const app = new Elysia({ prefix: '/api' }).use(health).use(domains);

	it('should handle health endpoint with prefix', async () => {
		const response = await app.handle(
			new Request('http://localhost/api/health')
		);

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.status).toBe('healthy');
	});

	it('should handle domain check endpoint with prefix', async () => {
		const response = await app.handle(
			new Request('http://localhost/api/domains/check', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: 'testapi',
				}),
			})
		);

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.keyword).toBe('testapi');
	});

	it('should return 404 for unknown routes', async () => {
		const response = await app.handle(
			new Request('http://localhost/api/unknown')
		);

		expect(response.status).toBe(404);
	});
});
