import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import NextTopLoader from 'nextjs-toploader';
import QueryProviders from '@/lib/providers/query-providers';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Domain Checker - Find Your Perfect Domain',
	description:
		'Check domain availability across multiple extensions instantly',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<NextTopLoader
					color='#3c47e6'
					initialPosition={0.08}
					crawlSpeed={200}
					height={3}
					crawl={true}
					showSpinner={true}
					easing='ease'
					speed={200}
				/>
				<QueryProviders>{children}</QueryProviders>
			</body>
		</html>
	);
}
