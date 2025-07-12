'use client';

import { useState } from 'react';
import { useCheckDomain } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export function DomainChecker() {
	const [domain, setDomain] = useState('');
	const checkDomain = useCheckDomain();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (domain.trim()) {
			checkDomain.mutate({ name: domain.trim() });
		}
	};

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle>Check Domain Availability</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='flex space-x-2'>
						<Input
							type='text'
							placeholder='Enter domain name'
							value={domain}
							onChange={(e) => setDomain(e.target.value)}
							disabled={checkDomain.isPending}
							pattern='^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$'
							title='Domain must start and end with alphanumeric characters'
						/>
						<Button
							type='submit'
							disabled={checkDomain.isPending || !domain.trim()}
						>
							{checkDomain.isPending ? (
								<Loader2 className='h-4 w-4 animate-spin' />
							) : (
								'Check'
							)}
						</Button>
					</div>
				</form>

				{checkDomain.error && (
					<Alert variant='destructive' className='mt-4'>
						<AlertDescription>
							{checkDomain.error.message}
						</AlertDescription>
					</Alert>
				)}

				{checkDomain.data && (
					<div className='mt-4 space-y-3'>
						<div className='text-muted-foreground text-sm'>
							Checked {checkDomain.data.totalChecked} domains for
							&quot;{checkDomain.data.keyword}&quot;
						</div>

						{checkDomain.data.availableDomains.length > 0 && (
							<Alert>
								<CheckCircle className='h-4 w-4' />
								<AlertDescription>
									Found{' '}
									{checkDomain.data.availableDomains.length}{' '}
									available domains!
								</AlertDescription>
							</Alert>
						)}

						<div className='space-y-2'>
							{checkDomain.data.results.map((result) => (
								<div
									key={result.domain}
									className='flex items-center justify-between rounded-lg border p-3'
								>
									<div className='flex items-center space-x-2'>
										{result.available ? (
											<CheckCircle className='h-4 w-4 text-green-500' />
										) : (
											<XCircle className='h-4 w-4 text-red-500' />
										)}
										<span className='font-medium'>
											{result.domain}
										</span>
									</div>
									<span className='text-muted-foreground text-sm'>
										{result.available
											? 'Available'
											: result.registrar || 'Registered'}
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
