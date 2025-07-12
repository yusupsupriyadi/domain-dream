import { Elysia } from 'elysia';
import { DomainService } from './service';
import { CheckDomainDto, DomainCheckResponse, ErrorResponse } from './model';

export const domains = new Elysia({ prefix: '/domains' }).post(
	'/check',
	async ({ body, set }) => {
		try {
			return await DomainService.checkMultipleDomains(body);
		} catch (error) {
			set.status = 500;
			return {
				error: 'Domain Check Failed',
				message: 'Unable to check domain availability at this time',
				details: error instanceof Error ? error.message : String(error),
			};
		}
	},
	{
		body: CheckDomainDto,
		response: {
			200: DomainCheckResponse,
			500: ErrorResponse,
		},
		detail: {
			summary: 'Check Multiple Domains',
			description:
				'Check domain availability across multiple TLDs using RDAP. If TLDs not specified, defaults to ["com", "id", "org"]',
			tags: ['Domains'],
		},
	}
);
