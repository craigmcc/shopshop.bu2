// lib/initialProfile.ts

/**
 * Populate the Profile for the logged-in User, if it does not already exist.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {currentUser, redirectToSignIn} from "@clerk/nextjs";
import {Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {db} from "@/lib/db";

// Public Objects ------------------------------------------------------------

export const initialProfile = async (): Promise<Profile> => {

    // Request sign in if needed
    const user = await currentUser();
    if (!user) {
        return redirectToSignIn();
    }

    // Look up and return the existing profile for this user (if any)
    const profile = await db.profile.findUnique({
        where:{
            userId: user.id
        }
    });
    if (profile) {
        return profile;
    }

    // Create a new profile and return it
    const newProfile = await db.profile.create({
        data: {
            email: user.emailAddresses[0].emailAddress,
            imageUrl: user.imageUrl,
            name: `${user.firstName} ${user.lastName}`,
            userId: user.id,
        }
    });
    return newProfile;

}
