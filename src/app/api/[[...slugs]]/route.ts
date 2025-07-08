import { Elysia, t } from 'elysia';

const app = new Elysia({ prefix: '/api' })
	// Basic endpoints
	.get('/', () => ({
		message: 'Welcome to Domain Dream API',
		version: '1.0.0',
	}))
	.get('/health', () => ({
		status: 'healthy',
		timestamp: new Date().toISOString(),
	}))

	// Example user endpoints
	.get('/users', () => {
		// TODO: Replace with actual database query
		return {
			users: [
				{ id: 1, name: 'John Doe', email: 'john@example.com' },
				{ id: 2, name: 'Jane Smith', email: 'jane@example.com' },
			],
			total: 2,
		};
	})
	.get('/users/:id', ({ params: { id } }) => {
		// TODO: Replace with actual database query
		return {
			id: parseInt(id),
			name: 'John Doe',
			email: 'john@example.com',
			createdAt: new Date().toISOString(),
		};
	})
	.post(
		'/users',
		({ body }) => {
			// TODO: Replace with actual database insert
			return {
				id: Math.floor(Math.random() * 1000),
				...body,
				createdAt: new Date().toISOString(),
			};
		},
		{
			body: t.Object({
				name: t.String(),
				email: t.String({
					format: 'email',
				}),
			}),
		}
	)

	// Example domain-related endpoints
	.get('/domains', () => {
		// TODO: Replace with actual domain checking logic
		return {
			domains: [
				{
					name: 'example.com',
					available: false,
					price: 12.99,
				},
				{
					name: 'mydomain.io',
					available: true,
					price: 29.99,
				},
			],
		};
	})
	.post(
		'/domains/check',
		({ body }) => {
			// TODO: Replace with actual domain availability check
			const isAvailable = Math.random() > 0.5;
			return {
				domain: body.domain,
				available: isAvailable,
				price: isAvailable ? 12.99 : null,
				alternatives: isAvailable
					? []
					: [
							`${body.domain}.net`,
							`${body.domain}.io`,
							`get${body.domain}.com`,
						],
			};
		},
		{
			body: t.Object({
				domain: t.String({
					minLength: 3,
					maxLength: 63,
					pattern: '^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$',
				}),
			}),
		}
	)

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
