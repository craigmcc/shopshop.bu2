"use server"

// actions/ListActions.ts

/**
 * Server side actions for List model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {List, MemberRole, Prisma, Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {db} from "@/lib/db";
import {BadRequest, Forbidden, NotFound, NotUnique, ServerError} from "@/lib/HttpErrors";
import logger from "@/lib/ServerLogger";


// Public Objects ------------------------------------------------------------

/**
 * Return all Lists that the specified Profile is a member of.
 *
 * @param profile                       Profile of the requesting User.
 */
export const all = async (profile: Profile): Promise<List[]> => {

    const lists = await db.list.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                }
            }
        }
    });
    return lists;

}

/**
 * Create and return a new List instance, if it satisfies validation.
 * The specified Profile will also be assigned the specified MemberRole
 * for this List.
 *
 * @param list                          List to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (list: Prisma.ListUncheckedCreateInput, memberRole: MemberRole): Promise<List> => {
    logger.info({
        context: "ListActions.insert",
        list: list,
    });
    // TODO - validations!
    try {
        const result = await db.list.create({
            data: {
                ...list,
                members: {
                    create: [
                        {profileId: list.profileId, role: memberRole}
                    ]
                },
            },
        });
        return result;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "ListActions.insert",
        );
    }

}
