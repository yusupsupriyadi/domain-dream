import { useQuery, useMutation } from '@tanstack/react-query';

interface DomainCheckResult {
	domain: string;
	available: boolean;
	price: number | null;
	alternatives: string[];
}

// Custom hooks for API calls
export const useUsers = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const response = await fetch('/api/users');
			if (!response.ok) {
				throw new Error('Failed to fetch users');
			}
			return response.json();
		},
	});
};

export const useUser = (id: number) => {
	return useQuery({
		queryKey: ['user', id],
		queryFn: async () => {
			const response = await fetch(`/api/users/${id}`);
			if (!response.ok) {
				throw new Error('Failed to fetch user');
			}
			return response.json();
		},
		enabled: !!id,
	});
};

export const useCreateUser = () => {
	return useMutation({
		mutationFn: async (data: { name: string; email: string }) => {
			const response = await fetch('/api/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				throw new Error('Failed to create user');
			}
			return response.json();
		},
	});
};

export const useDomains = () => {
	return useQuery({
		queryKey: ['domains'],
		queryFn: async () => {
			const response = await fetch('/api/domains');
			if (!response.ok) {
				throw new Error('Failed to fetch domains');
			}
			return response.json();
		},
	});
};

export const useCheckDomain = () => {
	return useMutation({
		mutationFn: async (domain: string): Promise<DomainCheckResult> => {
			const response = await fetch('/api/domains/check', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ domain }),
			});
			if (!response.ok) {
				throw new Error('Failed to check domain');
			}
			return response.json();
		},
	});
};
