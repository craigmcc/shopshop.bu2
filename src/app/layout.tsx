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
        <html lang="en">
        <body className={inter.className}>{children}</body>
        </html>
      </ClerkProvider>
  )
}
