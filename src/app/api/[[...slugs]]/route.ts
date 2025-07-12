import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { health } from './modules/health';
import { domains } from './modules/domains';

const app = new Elysia({ prefix: '/api' })
	// Add Swagger documentation
	.use(
		swagger({
			path: '/swagger',
			documentation: {
				info: {
					title: 'Domain Dream API',
					version: '1.0.0',
					description: 'API for domain availability checking',
				},
				tags: [
					{ name: 'Health', description: 'Health check endpoints' },
					{
						name: 'Domains',
						description: 'Domain checking endpoints',
					},
				],
			},
		})
	)
	// Mount modules
	.use(health)
	.use(domains)
	// Error handling
	.onError(({ code, error, set }) => {
		// Set appropriate status code
		if (code === 'VALIDATION') {
			set.status = 400;
			return {
				error: 'Validation Error',
				message: error instanceof Error ? error.message : String(error),
			};
		}

		if (code === 'NOT_FOUND') {
			set.status = 404;
			return {
				error: 'Not Found',
				message: 'The requested resource was not found',
			};
		}

		// Default error response
		set.status = 500;
		return {
			error: 'Internal Server Error',
			message:
				error instanceof Error
					? error.message
					: 'An unexpected error occurred',
		};
	});

// Export handlers for Next.js
export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const PATCH = app.handle;

// Export type for Eden Treaty
export type API = typeof app;
