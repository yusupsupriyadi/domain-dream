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
			// Process the domain name to handle cases like "example.com"
			let domainName = data.name;
			let extractedTld: string | undefined;

			// Check if the name contains a dot (full domain provided)
			if (domainName.includes('.')) {
				const parts = domainName.split('.');
				if (parts.length >= 2) {
					// Extract TLD from the domain
					extractedTld = parts[parts.length - 1];
					// Get the domain name without TLD
					domainName = parts.slice(0, -1).join('.');
				}
			}

			// Determine which TLDs to check
			let tlds: string[];
			if (data.tlds && data.tlds.length > 0) {
				// Use provided TLDs
				tlds = data.tlds;
			} else if (extractedTld) {
				// Use extracted TLD if no TLDs provided
				tlds = [extractedTld];
			} else {
				// Use default TLDs
				tlds = DEFAULT_TLDS;
			}

			return await domainChecker.checkKeywordTLDs(domainName, tlds);
		} catch (error) {
			throw new Error(
				`Failed to check domains for keyword ${data.name}: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	}
}
