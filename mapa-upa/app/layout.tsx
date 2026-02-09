'use client'

import { Geist, Geist_Mono, Figtree } from 'next/font/google'

import './globals.css'
import { useMapStore } from '@/store/useMapStore'
import { useEffect } from 'react'

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' })

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const loadKml = useMapStore(state => state.loadKml)

	useEffect(() => {
		loadKml()
	}, [loadKml])

	return (
		<html lang="en" className={figtree.variable}>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	)
}
