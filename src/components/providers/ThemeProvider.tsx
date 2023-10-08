"use client"
// app/components/providers/ThemeProvider.tsx

/**
 * Theme provider logic from Shadcn-UI.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
