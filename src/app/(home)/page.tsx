import CheckDomainInput from './partials/CheckDomainInput';
import { DotPattern } from '@/components/ui/dot-pattern';
import { TextAnimate } from '@/components/ui/text-animate';
import { BorderBeam } from '@/components/ui/border-beam';

export default function Home() {
	return (
		<div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-white'>
			{/* Background Pattern */}
			<DotPattern
				width={15}
				height={15}
				cx={1}
				cy={1}
				cr={0.5}
				className='[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] opacity-20'
			/>

			<div className='relative z-10 w-full max-w-md px-4'>
				<div className='relative overflow-hidden rounded-2xl border border-gray-100 bg-white/50 p-8 shadow-lg backdrop-blur-sm'>
					<BorderBeam
						size={250}
						duration={12}
						colorFrom='#e0e0e0'
						colorTo='#a0a0a0'
						borderWidth={1.5}
					/>
					{/* Header */}
					<div className='mb-8 text-center'>
						<TextAnimate
							animation='blurInUp'
							by='word'
							once
							className='mb-2 text-2xl font-bold text-black sm:text-3xl'
							as='h1'
						>
							Find Your Domain
						</TextAnimate>
						<TextAnimate
							animation='slideUp'
							by='word'
							once
							delay={0.5}
							className='text-sm text-gray-600 sm:text-base'
							as='p'
						>
							Search or generate your perfect domain name
						</TextAnimate>
					</div>

					{/* Main Content */}
					<CheckDomainInput />
				</div>
			</div>
		</div>
	);
}
