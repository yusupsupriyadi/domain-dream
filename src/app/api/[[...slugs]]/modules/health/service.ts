import type { ApiInfo, HealthCheck } from './model';

export class HealthService {
	static getApiInfo(): ApiInfo {
		return {
			message: 'Welcome to Domain Dream API',
			version: '1.0.0',
		};
	}

	static getHealthStatus(): HealthCheck {
		return {
			status: 'healthy',
			timestamp: new Date().toISOString(),
		};
	}
}
