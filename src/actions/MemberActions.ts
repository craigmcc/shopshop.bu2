"use server"

// actions/MemberActions.ts

/**
 * Server side actions for Member model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {List, Member, Prisma, Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {db} from "@/lib/db";
import {ServerError} from "@/lib/HttpErrors";
import logger from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

/**
 * Return all Lists that the specified Profile is a Member of.
 *
 * @param profileId                     ID of the Profile for which to return Lists
 *
 * @throws ServerError                  If some other error occurs
 */
export const allLists = async (profileId: string): Promise<List[]> => {
    logger.info({
        context: "MemberActions.allLists",
        profileId: profileId,
    });
    try {
        // TODO - and include memberRole somehow?
        return [];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "MemberActions.allLists",
        );
    }
}

/**
 * Return all Profiles that the specified List has a Member of.
 *
 * @param listId                        ID of the List for which to return Profiles
 *
 * @throws ServerError                  If some other error occurs
 */
export const allProfiles = async (listId: string): Promise<List[]> => {
    logger.info({
        context: "MemberActions.allProfiles",
        profileId: listId,
    });
    try {
        // TODO - and include memberRole somehow?
        return [];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "MemberActions.allProfiles",
        );
    }
}
