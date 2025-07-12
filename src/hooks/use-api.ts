import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface DomainCheckResult {
	domain: string;
	available: boolean;
	registrar?: string;
	registrationDate?: string;
	expirationDate?: string;
	message?: string;
}

interface DomainCheckResponse {
	keyword: string;
	totalChecked: number;
	availableDomains: string[];
	results: DomainCheckResult[];
}

// Custom hook for domain checking
export const useCheckDomain = () => {
	return useMutation({
		mutationFn: async (params: {
			name: string;
			tlds?: string[];
		}): Promise<DomainCheckResponse> => {
			const { data } = await api.post('/domains/check', params);
			return data;
		},
	});
};
