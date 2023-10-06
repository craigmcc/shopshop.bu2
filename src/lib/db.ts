// lib/db.ts

/**
 * Utility to return a single instance of PrismaClient, even in development mode.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {PrismaClient} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

declare global {
    var prisma: PrismaClient | undefined;
}

// Public Objects ------------------------------------------------------------

/**
 * A singleton instance of PrismaClient.
 */
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
