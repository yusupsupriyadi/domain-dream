'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
	borderWidth?: number;
	duration?: number;
	shineColor?: string | string[];
}

export function ShineBorder({
	borderWidth = 1,
	duration = 14,
	shineColor = '#000000',
	className,
	style,
	...props
}: ShineBorderProps) {
	return (
		<div
			style={
				{
					'--border-width': `${borderWidth}px`,
					'--duration': `${duration}s`,
					backgroundImage: `radial-gradient(transparent,transparent, ${
						Array.isArray(shineColor)
							? shineColor.join(',')
							: shineColor
					},transparent,transparent)`,
					backgroundSize: '300% 300%',
					mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
					WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
					WebkitMaskComposite: 'xor',
					maskComposite: 'exclude',
					padding: 'var(--border-width)',
					...style,
				} as React.CSSProperties
			}
			className={cn(
				'motion-safe:animate-shine pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position]',
				className
			)}
			{...props}
		/>
	);
}
