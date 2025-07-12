import fetch from 'node-fetch';

interface RDAPResponse {
	ldhName?: string;
	status?: string[];
	entities?: Array<{
		vcardArray?: unknown[];
		roles?: string[];
	}>;
	events?: Array<{
		eventAction: string;
		eventDate: string;
	}>;
}

interface DomainCheckResult {
	domain: string;
	available: boolean;
	registrar?: string;
	registrationDate?: string;
	expirationDate?: string;
	message?: string;
}

const DEFAULT_TLDS = [
	'com',
	'net',
	'org',
	'io',
	'co',
	'app',
	'dev',
	'ai',
	'me',
	'info',
	'xyz',
	'online',
	'site',
	'tech',
];

export class DomainChecker {
	private userAgent = 'DomainCheckerBot/1.0';

	/**
	 * Get RDAP URL for a specific TLD
	 */
	private getRDAPUrl(domain: string): string {
		const tld = domain.split('.').pop()?.toLowerCase() || '';

		// Special case for certain TLDs
		if (['ch', 'li'].includes(tld)) {
			return `https://rdap.nic.${tld}/domain/${domain}`;
		}

		// Common RDAP servers
		if (['com', 'net'].includes(tld)) {
			return `https://rdap.verisign.com/${tld}/v1/domain/${domain}`;
		}

		if (tld === 'org') {
			return `https://rdap.publicinterestregistry.org/rdap/domain/${domain}`;
		}

		// Fallback to generic RDAP
		return `https://rdap.org/domain/${domain}`;
	}

	/**
	 * Check RDAP data for a domain
	 */
	private async getRDAPData(domain: string): Promise<RDAPResponse | null> {
		try {
			const rdapUrl = this.getRDAPUrl(domain);
			const response = await fetch(rdapUrl, {
				headers: {
					Accept: 'application/rdap+json',
					'User-Agent': this.userAgent,
				},
			});

			if (response.status === 200) {
				return (await response.json()) as RDAPResponse;
			}

			return null;
		} catch (error) {
			console.error(`RDAP error for ${domain}:`, error);
			return null;
		}
	}

	/**
	 * Extract registrar information from RDAP response
	 */
	private extractRegistrar(rdapData: RDAPResponse): string {
		if (!rdapData.entities) return 'Unknown';

		for (const entity of rdapData.entities) {
			if (entity.roles?.includes('registrar')) {
				const vcardArray = entity.vcardArray;
				if (Array.isArray(vcardArray) && vcardArray.length > 1) {
					const vcardData = vcardArray[1];
					if (Array.isArray(vcardData)) {
						for (const entry of vcardData) {
							if (
								Array.isArray(entry) &&
								(entry[0] === 'fn' || entry[0] === 'org') &&
								entry[3]
							) {
								return String(entry[3]);
							}
						}
					}
				}
			}
		}

		return 'Unknown';
	}

	/**
	 * Extract dates from RDAP response
	 */
	private extractDates(rdapData: RDAPResponse): {
		registrationDate?: string;
		expirationDate?: string;
	} {
		const dates: { registrationDate?: string; expirationDate?: string } =
			{};

		if (rdapData.events) {
			for (const event of rdapData.events) {
				if (event.eventAction === 'registration') {
					dates.registrationDate = event.eventDate;
				} else if (event.eventAction === 'expiration') {
					dates.expirationDate = event.eventDate;
				}
			}
		}

		return dates;
	}

	/**
	 * Check if a single domain is available
	 */
	async checkDomain(domain: string): Promise<DomainCheckResult> {
		console.log(`Checking domain: ${domain}`);

		const rdapData = await this.getRDAPData(domain);

		if (rdapData) {
			// Domain is registered
			const registrar = this.extractRegistrar(rdapData);
			const { registrationDate, expirationDate } =
				this.extractDates(rdapData);

			return {
				domain,
				available: false,
				registrar,
				registrationDate,
				expirationDate,
				message: 'Domain is registered',
			};
		}

		// Domain appears to be available
		return {
			domain,
			available: true,
			message: 'Domain appears to be available',
		};
	}

	/**
	 * Check a keyword across multiple TLDs
	 */
	async checkKeywordTLDs(
		keyword: string,
		tlds: string[] = DEFAULT_TLDS
	): Promise<{
		keyword: string;
		totalChecked: number;
		availableDomains: string[];
		results: DomainCheckResult[];
	}> {
		console.log(`Checking keyword: ${keyword} across TLDs`);

		const results: DomainCheckResult[] = [];
		const availableDomains: string[] = [];

		// Check each TLD
		for (const tld of tlds) {
			const domain = `${keyword}.${tld}`;
			const result = await this.checkDomain(domain);

			results.push(result);
			if (result.available) {
				availableDomains.push(domain);
			}

			// Small delay to avoid rate limiting
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		return {
			keyword,
			totalChecked: tlds.length,
			availableDomains,
			results,
		};
	}
}
