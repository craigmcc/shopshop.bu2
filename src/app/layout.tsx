// app/layout.tsx

/**
 * Overall layout for the entire application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import type { Metadata } from 'next';
import {Inter} from "next/font/google";
import {ClerkProvider} from "@clerk/nextjs";

// Internal Modules ----------------------------------------------------------

import './globals.css'
import {ModalProvider} from "@/components/providers/ModalProvider";
import {ThemeProvider} from "@/components/providers/ThemeProvider";
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
            <html lang="en" suppressHydrationWarning>
            <body className={cn(
                inter.className,
                // "bg-indigo-50 dark:indigo-900"
            )}>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={false}
                storageKey="shopshop-theme"
            >
                <ModalProvider/>
                {/*<TopBar/>*/}
                {children}
            </ThemeProvider>
            </body>
            </html>
        </ClerkProvider>
    )
}
