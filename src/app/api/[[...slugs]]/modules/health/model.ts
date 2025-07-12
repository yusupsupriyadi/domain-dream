import { t } from 'elysia';

// Response models
export const ApiInfoResponse = t.Object({
	message: t.String(),
	version: t.String(),
});

export const HealthCheckResponse = t.Object({
	status: t.Literal('healthy'),
	timestamp: t.String({ format: 'date-time' }),
});

// Type inference
export type ApiInfo = typeof ApiInfoResponse.static;
export type HealthCheck = typeof HealthCheckResponse.static;
