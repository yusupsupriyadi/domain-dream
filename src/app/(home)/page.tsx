import CheckDomainInput from './partials/CheckDomainInput';
import { DotPattern } from '@/components/ui/dot-pattern';
import { TextAnimate } from '@/components/ui/text-animate';

export default function Home() {
	return (
		<div className='relative min-h-screen overflow-hidden bg-white'>
			{/* Background Pattern */}
			<DotPattern
				width={20}
				height={20}
				cx={1}
				cy={1}
				cr={1}
				className='[mask-image:radial-gradient(800px_circle_at_center,white,transparent)] opacity-30'
			/>

			<div className='relative z-10 mx-auto max-w-7xl px-4 py-20'>
				{/* Header */}
				<div className='mb-16 text-center'>
					<TextAnimate
						animation='blurInUp'
						by='word'
						once
						className='mb-6 text-5xl font-bold text-black md:text-6xl'
						as='h1'
					>
						Find Your Domain
					</TextAnimate>
					<TextAnimate
						animation='slideUp'
						by='word'
						once
						delay={0.5}
						className='mx-auto max-w-3xl text-lg text-gray-600 md:text-xl'
						as='p'
					>
						Discover, purchase, and register your dream domain with
						our domain search or AI domain generator.
					</TextAnimate>
				</div>

				{/* Main Content */}
				<div className='mx-auto max-w-4xl'>
					<CheckDomainInput />
				</div>
			</div>
		</div>
	);
}
