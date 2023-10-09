// middleware.ts

/**
 * Middleware to enforce authentication requirements using Clerk.
 *
 * @packageDocumention
 */

// External Modules ----------------------------------------------------------

import { authMiddleware } from "@clerk/nextjs";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
    publicRoutes: ["/", "/api/uploadthing"],
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
