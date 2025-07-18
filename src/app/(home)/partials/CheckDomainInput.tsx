'use client';
import { useCheckDomain } from '@/hooks/use-api';
import { useState } from 'react';
import { Loader2, Search, Sparkles } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';

export default function CheckDomainInput() {
	const checkDomain = useCheckDomain();
	const [domainInput, setDomainInput] = useState('');
	const [mode, setMode] = useState<'search' | 'generator'>('search');

	const handleDomainCheck = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!domainInput.trim()) return;

		checkDomain.mutate({
			name: domainInput.trim(),
			tlds: ['com', 'id', 'org', 'net', 'io'],
		});
	};

	return (
		<div className='space-y-8'>
			{/* Mode Toggle */}
			<div className='flex justify-center'>
				<div className='inline-flex rounded-full border border-gray-200 bg-gray-50 p-1'>
					<button
						type='button'
						onClick={() => setMode('search')}
						className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all ${
							mode === 'search'
								? 'bg-black text-white shadow-sm'
								: 'text-gray-600 hover:text-gray-900'
						}`}
					>
						Search Domain
					</button>
					<button
						type='button'
						onClick={() => setMode('generator')}
						className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all ${
							mode === 'generator'
								? 'bg-black text-white shadow-sm'
								: 'text-gray-600 hover:text-gray-900'
						}`}
					>
						<Sparkles className='h-4 w-4' />
						AI Generator
					</button>
				</div>
			</div>

			{/* Search Input */}
			<form onSubmit={handleDomainCheck} className='relative'>
				<div className='relative'>
					<div className='absolute top-1/2 left-6 -translate-y-1/2'>
						<Search className='h-5 w-5 text-gray-400' />
					</div>
					<input
						type='text'
						value={domainInput}
						onChange={(e) => setDomainInput(e.target.value)}
						placeholder='Find your domain'
						className='w-full rounded-2xl border border-gray-200 bg-white py-5 pr-40 pl-14 text-lg font-medium text-gray-900 placeholder-gray-400 shadow-sm focus:border-gray-400 focus:ring-0 focus:outline-none'
						disabled={checkDomain.isPending}
					/>
					<div className='absolute top-1/2 right-2 -translate-y-1/2'>
						<ShimmerButton
							type='submit'
							disabled={
								checkDomain.isPending || !domainInput.trim()
							}
							shimmerColor='#ffffff'
							background='rgba(0, 0, 0, 1)'
							borderRadius='0.75rem'
							className='px-8 py-3 disabled:cursor-not-allowed disabled:opacity-50'
						>
							{checkDomain.isPending ? (
								<Loader2 className='h-5 w-5 animate-spin' />
							) : (
								'Search'
							)}
						</ShimmerButton>
					</div>
				</div>
			</form>

			{/* Results */}
			{checkDomain.data && (
				<div className='mx-auto max-w-3xl space-y-4'>
					<h3 className='text-center text-xl font-semibold text-gray-900'>
						Search Results
					</h3>
					<div className='space-y-3'>
						{checkDomain.data.results.map((result) => (
							<div
								key={result.domain}
								className={`flex items-center justify-between rounded-xl border p-4 backdrop-blur-sm transition-all hover:shadow-lg ${
									result.available
										? 'border-green-200 bg-green-50/80'
										: 'border-red-200 bg-red-50/80'
								}`}
							>
								<span className='text-lg font-medium text-gray-900'>
									{result.domain}
								</span>
								<div className='flex items-center gap-3'>
									<span
										className={`text-sm font-medium ${
											result.available
												? 'text-green-600'
												: 'text-red-600'
										}`}
									>
										{result.available
											? 'Available'
											: 'Unavailable'}
									</span>
									{result.available && (
										<ShimmerButton
											shimmerColor='#ffffff'
											background='rgba(0, 0, 0, 1)'
											borderRadius='0.5rem'
											className='px-4 py-2 text-sm'
										>
											Buy Domain
										</ShimmerButton>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Error State */}
			{checkDomain.isError && (
				<div className='mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-4'>
					<p className='text-center text-red-600'>
						An error occurred while checking the domain. Please try
						again.
					</p>
				</div>
			)}
		</div>
	);
}
