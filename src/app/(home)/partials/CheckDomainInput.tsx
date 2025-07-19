'use client';
import { useCheckDomain } from '@/hooks/use-api';
import { useState } from 'react';
import { Loader2, Search, Sparkles } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { ShineBorder } from '@/components/ui/shine-border';

export default function CheckDomainInput() {
	const checkDomain = useCheckDomain();
	const [domainInput, setDomainInput] = useState('');
	const [mode, setMode] = useState<'search' | 'generator'>('search');

	const handleDomainCheck = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!domainInput.trim()) return;

		checkDomain.mutate({
			name: domainInput.trim(),
			// Let backend handle TLD extraction and defaults
		});
	};

	return (
		<div className='space-y-6'>
			{/* Mode Toggle */}
			<div className='flex justify-center'>
				<div className='inline-flex rounded-full border border-gray-200 bg-gray-50 p-0.5'>
					<button
						type='button'
						onClick={() => setMode('search')}
						className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
							mode === 'search'
								? 'bg-black text-white shadow-sm'
								: 'text-gray-600 hover:text-gray-900'
						}`}
					>
						Search
					</button>
					<button
						type='button'
						onClick={() => setMode('generator')}
						className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
							mode === 'generator'
								? 'bg-black text-white shadow-sm'
								: 'text-gray-600 hover:text-gray-900'
						}`}
					>
						<Sparkles className='h-3 w-3' />
						AI
					</button>
				</div>
			</div>

			{/* Search Input */}
			<form onSubmit={handleDomainCheck} className='relative'>
				<div className='relative overflow-hidden rounded-lg'>
					<ShineBorder
						borderWidth={1}
						duration={10}
						shineColor={['#d0d0d0', '#a0a0a0', '#808080']}
					/>
					<div className='relative'>
						<div className='absolute top-1/2 left-4 -translate-y-1/2'>
							<Search className='h-4 w-4 text-gray-400' />
						</div>
						<input
							type='text'
							value={domainInput}
							onChange={(e) => setDomainInput(e.target.value)}
							placeholder='Enter domain name'
							className='w-full rounded-lg border border-gray-200 bg-white py-3 pr-24 pl-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-gray-400 focus:ring-0 focus:outline-none'
							disabled={checkDomain.isPending}
						/>
						<div className='absolute top-1/2 right-1.5 -translate-y-1/2'>
							<ShimmerButton
								type='submit'
								disabled={
									checkDomain.isPending || !domainInput.trim()
								}
								shimmerColor='#ffffff'
								background='rgba(0, 0, 0, 1)'
								borderRadius='0.375rem'
								className='px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50'
							>
								{checkDomain.isPending ? (
									<Loader2 className='h-3.5 w-3.5 animate-spin' />
								) : (
									'Search'
								)}
							</ShimmerButton>
						</div>
					</div>
				</div>
			</form>

			{/* Results */}
			{checkDomain.data && (
				<div className='mt-3 space-y-3'>
					{(() => {
						// Extract TLD from input if present
						const inputParts = domainInput.trim().split('.');
						const extractedTld =
							inputParts.length >= 2
								? inputParts[inputParts.length - 1]
								: null;

						// Separate searched domain from others
						const searchedDomain = extractedTld
							? checkDomain.data.results.find((r) =>
									r.domain.endsWith(`.${extractedTld}`)
								)
							: null;

						const otherDomains = checkDomain.data.results.filter(
							(r) =>
								!extractedTld ||
								!r.domain.endsWith(`.${extractedTld}`)
						);

						return (
							<>
								{/* Searched Domain Section */}
								{searchedDomain && (
									<div>
										<p className='mb-1.5 text-xs font-medium text-gray-600'>
											Searched domain:
										</p>
										<div className='grid grid-cols-3 gap-1'>
											{[searchedDomain].map((result) => (
												<div
													key={result.domain}
													className={`rounded border p-1.5 text-[10px] transition-all hover:shadow-sm ${
														result.available
															? 'border-green-200 bg-green-50/50'
															: 'border-red-200 bg-red-50/50'
													}`}
												>
													<div className='flex items-center justify-between'>
														<span className='font-medium text-gray-900'>
															{result.domain}
														</span>
														<span
															className={`${
																result.available
																	? 'text-green-600'
																	: 'text-red-600'
															}`}
														>
															{result.available
																? '✓'
																: '✗'}
														</span>
													</div>
													{!result.available && (
														<div className='mt-0.5 space-y-0.5 text-[9px] text-gray-600'>
															{result.registrar && (
																<p className='truncate'>
																	{
																		result.registrar
																	}
																</p>
															)}
															<div className='flex items-center justify-between'>
																{result.registrationDate && (
																	<p>
																		R:{' '}
																		{new Date(
																			result.registrationDate
																		).getMonth() +
																			1}
																		/
																		{new Date(
																			result.registrationDate
																		).getFullYear()}
																	</p>
																)}
																{result.expirationDate && (
																	<p>
																		E:{' '}
																		{new Date(
																			result.expirationDate
																		).getMonth() +
																			1}
																		/
																		{new Date(
																			result.expirationDate
																		).getFullYear()}
																	</p>
																)}
															</div>
														</div>
													)}
												</div>
											))}
										</div>
									</div>
								)}

								{/* Other Domains Section */}
								{otherDomains.length > 0 && (
									<div>
										<p className='mb-1.5 text-xs font-medium text-gray-600'>
											Other results:
										</p>
										<div className='grid grid-cols-3 gap-1'>
											{otherDomains.map((result) => (
												<div
													key={result.domain}
													className={`rounded border p-1.5 text-[10px] transition-all hover:shadow-sm ${
														result.available
															? 'border-green-200 bg-green-50/50'
															: 'border-red-200 bg-red-50/50'
													}`}
												>
													<div className='flex items-center justify-between'>
														<span className='font-medium text-gray-900'>
															{result.domain}
														</span>
														<span
															className={`${
																result.available
																	? 'text-green-600'
																	: 'text-red-600'
															}`}
														>
															{result.available
																? '✓'
																: '✗'}
														</span>
													</div>
													{!result.available && (
														<div className='mt-0.5 space-y-0.5 text-[9px] text-gray-600'>
															{result.registrar && (
																<p className='truncate'>
																	{
																		result.registrar
																	}
																</p>
															)}
															<div className='flex items-center justify-between'>
																{result.registrationDate && (
																	<p>
																		R:{' '}
																		{new Date(
																			result.registrationDate
																		).getMonth() +
																			1}
																		/
																		{new Date(
																			result.registrationDate
																		).getFullYear()}
																	</p>
																)}
																{result.expirationDate && (
																	<p>
																		E:{' '}
																		{new Date(
																			result.expirationDate
																		).getMonth() +
																			1}
																		/
																		{new Date(
																			result.expirationDate
																		).getFullYear()}
																	</p>
																)}
															</div>
														</div>
													)}
												</div>
											))}
										</div>
									</div>
								)}
							</>
						);
					})()}
				</div>
			)}

			{/* Error State */}
			{checkDomain.isError && (
				<div className='rounded-lg border border-red-200 bg-red-50 p-3'>
					<p className='text-center text-xs text-red-600'>
						Error checking domain. Please try again.
					</p>
				</div>
			)}
		</div>
	);
}
