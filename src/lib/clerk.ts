// lib/clerk.ts

/**
 * Utility functions related to the Clerk authentication system.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {auth} from "@clerk/nextjs";

// Internal Modules ----------------------------------------------------------

import {db} from "@/lib/db";

// Public Objects ------------------------------------------------------------

/**
 * Return the Profile of the currently logged-in user (if any), or null.
 */
export const currentProfile = async () => {

    const {userId} = auth();
    if (!userId) {
        return null;
    } else {
        // TODO - convert to a server action?
        const profile = await db.profile.findUnique({
            where: {
                userId
            }
        });
        return profile;
    }

}
