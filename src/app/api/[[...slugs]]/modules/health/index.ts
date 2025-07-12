import { Elysia } from 'elysia';
import { HealthService } from './service';
import { ApiInfoResponse, HealthCheckResponse } from './model';

export const health = new Elysia()
	.get('/', () => HealthService.getApiInfo(), {
		response: {
			200: ApiInfoResponse,
		},
		detail: {
			summary: 'API Information',
			description: 'Get basic information about the API',
			tags: ['Health'],
		},
	})
	.get('/health', () => HealthService.getHealthStatus(), {
		response: {
			200: HealthCheckResponse,
		},
		detail: {
			summary: 'Health Check',
			description: 'Check if the API is healthy and running',
			tags: ['Health'],
		},
	});
