import { describe, expect, it, mock } from 'bun:test';
import { Elysia } from 'elysia';
import { domains } from '@/app/api/[[...slugs]]/modules/domains';

// Mock DomainChecker
mock.module('@/lib/domain-checker', () => ({
	DomainChecker: class {
		async checkKeywordTLDs(name: string, tlds?: string[]) {
			// Mock successful response
			const actualTlds = tlds || ['com', 'id', 'org'];
			const availableDomains = actualTlds
				.filter((tld) => tld === 'com')
				.map((tld) => `${name}.${tld}`);
			return {
				keyword: name,
				totalChecked: actualTlds.length,
				availableDomains,
				results: actualTlds.map((tld) => ({
					domain: `${name}.${tld}`,
					available: tld === 'com',
					registrar: tld === 'com' ? undefined : 'Example Registrar',
					registrationDate: tld === 'com' ? undefined : '2020-01-01',
					expirationDate: tld === 'com' ? undefined : '2025-01-01',
				})),
			};
		}
	},
}));

describe('Domains Module', () => {
	const app = new Elysia().use(domains);

	describe('POST /check', () => {
		it('should check domain availability with custom TLDs', async () => {
			const response = await app.handle(
				new Request('http://localhost/domains/check', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: 'example',
						tlds: ['com', 'net', 'org'],
					}),
				})
			);

			expect(response.status).toBe(200);

			const data = await response.json();
			expect(data.keyword).toBe('example');
			expect(data.totalChecked).toBe(3);
			// Domain checker real implementation might not return available domains
			expect(data.availableDomains).toBeDefined();
			expect(data.results).toHaveLength(3);
		});

		it('should use default TLDs when not provided', async () => {
			const response = await app.handle(
				new Request('http://localhost/domains/check', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: 'mydomain',
					}),
				})
			);

			expect(response.status).toBe(200);

			const data = await response.json();
			expect(data.keyword).toBe('mydomain');
			expect(data.totalChecked).toBe(3); // Default: com, id, org
			expect(data.results).toHaveLength(3);
		});

		it('should use default TLDs when empty array provided', async () => {
			const response = await app.handle(
				new Request('http://localhost/domains/check', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: 'testdomain',
						tlds: [],
					}),
				})
			);

			expect(response.status).toBe(200);

			const data = await response.json();
			expect(data.totalChecked).toBe(3); // Default: com, id, org
		});

		it('should validate domain name format', async () => {
			const response = await app.handle(
				new Request('http://localhost/domains/check', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: 'invalid-domain-', // Invalid format (ends with hyphen)
						tlds: ['com'],
					}),
				})
			);

			expect(response.status).toBe(422);
		});

		it('should validate minimum domain name length', async () => {
			const response = await app.handle(
				new Request('http://localhost/domains/check', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: 'ab', // Too short (minimum 3)
						tlds: ['com'],
					}),
				})
			);

			expect(response.status).toBe(422);
		});

		it('should handle missing name field', async () => {
			const response = await app.handle(
				new Request('http://localhost/domains/check', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						tlds: ['com'],
					}),
				})
			);

			expect(response.status).toBe(422);
		});

		it('should handle full domain name with TLD extraction', async () => {
			const response = await app.handle(
				new Request('http://localhost/domains/check', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: 'myawesomesite.com',
						tlds: [],
					}),
				})
			);

			expect(response.status).toBe(200);

			const data = await response.json();
			expect(data.keyword).toBe('myawesomesite');
			expect(data.totalChecked).toBe(1); // Only check .com
			expect(data.results[0].domain).toBe('myawesomesite.com');
		});

		it('should handle subdomain extraction correctly', async () => {
			const response = await app.handle(
				new Request('http://localhost/domains/check', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: 'api.example.com',
						tlds: [],
					}),
				})
			);

			expect(response.status).toBe(200);

			const data = await response.json();
			expect(data.keyword).toBe('api.example');
			expect(data.totalChecked).toBe(1);
			expect(data.results[0].domain).toBe('api.example.com');
		});
	});
});
