import { DomainChecker } from '@/lib/domain-checker';
import type { CheckDomainDto, DomainCheckResponse } from './model';

// Initialize domain checker
const domainChecker = new DomainChecker();

// Default TLDs when not specified
const DEFAULT_TLDS = ['com', 'id', 'org'];

export class DomainService {
	static async checkMultipleDomains(
		data: CheckDomainDto
	): Promise<DomainCheckResponse> {
		try {
			// Use default TLDs if not provided, null, or empty array
			const tlds =
				data.tlds && data.tlds.length > 0 ? data.tlds : DEFAULT_TLDS;

			return await domainChecker.checkKeywordTLDs(data.name, tlds);
		} catch (error) {
			throw new Error(
				`Failed to check domains for keyword ${data.name}: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	}
}
