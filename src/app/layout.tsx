// app/layout.tsx

/**
 * Overall layout for the entire application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {ClerkProvider} from "@clerk/nextjs";

// Internal Modules ----------------------------------------------------------

import './globals.css'
import {ModalProvider} from "@/components/layout/ModalProvider";
import {TopBar} from "@/components/layout/TopBar";
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

// Public Objects -----------------------------------------------------------

export const metadata: Metadata = {
    title: 'ShopShop',
    description: 'Shipping List Application',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <ModalProvider/>
            <html lang="en">
            <body className={cn(
                inter.className,
                "bg-indigo-50"
            )}>
            <TopBar/>
            {children}
            </body>
            </html>
        </ClerkProvider>
    )
}
