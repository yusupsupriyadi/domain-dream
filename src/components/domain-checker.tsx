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
			checkDomain.mutate(domain.trim());
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
					<div className='mt-4 space-y-2'>
						<Alert
							variant={
								checkDomain.data.available
									? 'default'
									: 'destructive'
							}
						>
							<div className='flex items-center space-x-2'>
								{checkDomain.data.available ? (
									<CheckCircle className='h-4 w-4' />
								) : (
									<XCircle className='h-4 w-4' />
								)}
								<AlertDescription>
									<strong>
										{checkDomain.data.domain}.com
									</strong>{' '}
									is{' '}
									{checkDomain.data.available
										? 'available'
										: 'not available'}
									{checkDomain.data.available &&
										checkDomain.data.price &&
										` for $${checkDomain.data.price}/year`}
								</AlertDescription>
							</div>
						</Alert>

						{!checkDomain.data.available &&
							checkDomain.data.alternatives.length > 0 && (
								<div className='space-y-1'>
									<p className='text-muted-foreground text-sm'>
										Alternative suggestions:
									</p>
									<ul className='space-y-1 text-sm'>
										{checkDomain.data.alternatives.map(
											(alt) => (
												<li key={alt} className='ml-4'>
													• {alt}
												</li>
											)
										)}
									</ul>
								</div>
							)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
