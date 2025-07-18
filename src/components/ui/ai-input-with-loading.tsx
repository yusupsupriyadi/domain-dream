'use client';

import { CornerRightUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';

interface AIInputWithLoadingProps {
	id?: string;
	placeholder?: string;
	minHeight?: number;
	maxHeight?: number;
	loadingDuration?: number;
	thinkingDuration?: number;
	onSubmit?: (value: string) => void | Promise<void>;
	className?: string;
	autoAnimate?: boolean;
}

export function AIInputWithLoading({
	id = 'ai-input-with-loading',
	placeholder = 'Ask me anything!',
	minHeight = 56,
	maxHeight = 200,
	loadingDuration = 3000,
	thinkingDuration = 1000,
	onSubmit,
	className,
	autoAnimate = false,
}: AIInputWithLoadingProps) {
	const [inputValue, setInputValue] = useState('');
	const [submitted, setSubmitted] = useState(autoAnimate);
	const [isAnimating] = useState(autoAnimate);

	const { textareaRef, adjustHeight } = useAutoResizeTextarea({
		minHeight,
		maxHeight,
	});

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const runAnimation = () => {
			if (!isAnimating) return;
			setSubmitted(true);
			timeoutId = setTimeout(() => {
				setSubmitted(false);
				timeoutId = setTimeout(runAnimation, thinkingDuration);
			}, loadingDuration);
		};

		if (isAnimating) {
			runAnimation();
		}

		return () => clearTimeout(timeoutId);
	}, [isAnimating, loadingDuration, thinkingDuration]);

	const handleSubmit = async () => {
		if (!inputValue.trim() || submitted) return;

		setSubmitted(true);
		await onSubmit?.(inputValue);
		setInputValue('');
		adjustHeight(true);

		setTimeout(() => {
			setSubmitted(false);
		}, loadingDuration);
	};

	return (
		<div className={cn('w-full py-4', className)}>
			<div className='relative mx-auto flex w-full max-w-xl flex-col items-start gap-2'>
				<div className='relative mx-auto w-full max-w-xl'>
					<Textarea
						id={id}
						placeholder={placeholder}
						className={cn(
							'w-full max-w-xl rounded-3xl bg-white/30 py-4 pr-10 pl-6',
							'placeholder:text-black/70 dark:placeholder:text-white/70',
							'border-none ring-black/30 dark:ring-white/30',
							'resize-none leading-[1.2] text-wrap text-black dark:text-white',
							`min-h-[${minHeight}px]`
						)}
						ref={textareaRef}
						value={inputValue}
						onChange={(e) => {
							setInputValue(e.target.value);
							adjustHeight();
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								handleSubmit();
							}
						}}
						disabled={submitted}
					/>
					<button
						onClick={handleSubmit}
						className={cn(
							'absolute top-1/2 right-3 -translate-y-1/2 rounded-xl px-1 py-1',
							submitted ? 'bg-none' : 'bg-black/5 dark:bg-white/5'
						)}
						type='button'
						disabled={submitted}
					>
						{submitted ? (
							<div
								className='h-4 w-4 animate-spin rounded-sm bg-black transition duration-700 dark:bg-white'
								style={{ animationDuration: '3s' }}
							/>
						) : (
							<CornerRightUp
								className={cn(
									'h-4 w-4 transition-opacity dark:text-white',
									inputValue ? 'opacity-100' : 'opacity-30'
								)}
							/>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
