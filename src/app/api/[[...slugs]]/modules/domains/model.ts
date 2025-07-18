import { t } from 'elysia';

// Request models
export const CheckDomainDto = t.Object({
	name: t.String({
		minLength: 3,
		maxLength: 253,
		pattern: '^[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]$',
		description: 'Domain keyword or full domain to check',
		example: 'myawesomesite or myawesomesite.com',
	}),
	tlds: t.Optional(
		t.Array(
			t.String({
				minLength: 2,
				maxLength: 10,
				description: 'TLD extension',
				example: 'com',
			}),
			{
				description:
					'List of TLDs to check (default: ["com", "id", "ai", "org", "net", "io"])',
				example: ['com', 'net', 'org', 'io', 'ai', 'dev'],
			}
		)
	),
});

// Response models
export const DomainCheckResult = t.Object({
	domain: t.String(),
	available: t.Boolean(),
	registrar: t.Optional(t.String()),
	registrationDate: t.Optional(t.String()),
	expirationDate: t.Optional(t.String()),
	message: t.Optional(t.String()),
});

export const DomainCheckResponse = t.Object({
	keyword: t.String(),
	totalChecked: t.Number(),
	availableDomains: t.Array(t.String()),
	results: t.Array(DomainCheckResult),
});

export const ErrorResponse = t.Object({
	error: t.String(),
	message: t.String(),
	details: t.Optional(t.String()),
});

// Type inference
export type CheckDomainDto = typeof CheckDomainDto.static;
export type DomainCheckResult = typeof DomainCheckResult.static;
export type DomainCheckResponse = typeof DomainCheckResponse.static;
