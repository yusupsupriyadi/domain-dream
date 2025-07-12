import { describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import { health } from '@/app/api/[[...slugs]]/modules/health';

describe('Health Module', () => {
	const app = new Elysia().use(health);

	describe('GET /', () => {
		it('should return API information', async () => {
			const response = await app.handle(new Request('http://localhost/'));

			expect(response.status).toBe(200);

			const data = await response.json();
			expect(data).toEqual({
				message: 'Welcome to Domain Dream API',
				version: '1.0.0',
			});
		});
	});

	describe('GET /health', () => {
		it('should return health status', async () => {
			const response = await app.handle(
				new Request('http://localhost/health')
			);

			expect(response.status).toBe(200);

			const data = await response.json();
			expect(data.status).toBe('healthy');
			expect(data.timestamp).toBeDefined();
			expect(new Date(data.timestamp)).toBeInstanceOf(Date);
		});
	});
});
