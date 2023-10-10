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
import {NotFound, ServerError} from "@/lib/HttpErrors";
import logger from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

/**
 * Return the Profile for the specified *userId* (not id).
 *
 * @param userId                        User ID of the requested Profile
 *
 * @throws NotFound                     If no such Profile can be found
 * @throws ServerError                  If some other error occurs
 */
export const findByUserId = async (userId: string): Promise<Profile> => {
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
        if (result) {
            return result;
        } else {
            throw new NotFound(
                `Missing Profile for userId '${userId}'`,
                "ProfileActions.findByUserId",
            );
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "ProfileActions.findByUserId",
            );
        }
    }

}
