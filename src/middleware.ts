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
    publicRoutes: ["/", "/api/uploadthing",
    "/api/populate/4bda86d6-dd85-4ae0-96eb-6561986d71ae",
    "/api/populate/0d14cdaf-ca91-4e1c-91ed-047f6fd4b2f5"],
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
