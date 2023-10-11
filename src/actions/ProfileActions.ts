"use server"

// actions/ProfileActions.ts

/**
 * Server side actions for Profile model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma, Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {db} from "@/lib/db";
import {ServerError} from "@/lib/HttpErrors";
import logger from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

/**
 * Return the Profile for the specified *userId* (not id).  If none is found,
 * return null.
 *
 * @param userId                        User ID of the requested Profile
 *
 * @throws ServerError                  If some other error occurs
 */
export const findByUserId = async (userId: string): Promise<Profile | null> => {
    logger.info({
        context: "ProfileActions.findByUserId",
        userId: userId,
    });
    try {
        const result = await db.profile.findUnique({
            where: {
                userId: userId,
            }
        });
        return result;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "ProfileActions.findByUserId",
        );
    }

}
