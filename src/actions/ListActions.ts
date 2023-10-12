"use server"

// actions/ListActions.ts

/**
 * Server side actions for List model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {v4 as uuidv4} from "uuid";
import {List, Member, MemberRole, Prisma, Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {db} from "@/lib/db";
import {BadRequest, Forbidden, NotFound, NotUnique, ServerError} from "@/lib/HttpErrors";
import {currentProfile} from "@/lib/clerk";
import logger from "@/lib/ServerLogger";
import {ListWithMembersWithProfiles} from "@/types";


// Public Objects ------------------------------------------------------------

/**
 * Return all Lists that the specified Profile is a Member of,
 * in ascending order by name.  If there are none, return an empty array.
 *
 * @param profileId                     ID of the Profile of the requesting User.
 */
export const all = async (profileId: string): Promise<List[]> => {
    logger.info({
        context: "ProfileActions.all",
        profileId: profileId,
    });
    try {
        const lists = await db.list.findMany({
            orderBy: [
                {name: "asc"},
            ],
            where: {
                members: {
                    some: {
                        profileId: profileId,
                    }
                }
            }
        });
        return lists;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "ListActions.all"
        );
    }

}

/**
 * Find and return the List instance with the specified listId for the
 * specified profileId, if any.  If none can be found, return null.
 *
 * @param profileId                     ID of the signed-in User
 * @param listId                        ID of the List to be returned
 *
 * @throws ServerError                  If some other error occurs
 */
export const find = async (profileId: string, listId: string)
    : Promise<ListWithMembersWithProfiles | null> => {
    logger.info({
        context: "ListActions.find",
        profileId: profileId,
        listId: listId,
    });
    try {
        // TODO - make the include stuff conditional?
        const list = await db.list.findUnique({
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    }
                }
            },
            where: {
                id: listId,
                members: {
                    some: {
                        profileId: profileId,
                    }
                }
            }
        });
        return list;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "ListActions.find",
        );
    }
}

/**
 * Create and return a new List instance, if it satisfies validation.
 * The calling User's Profile will also be assigned the specified MemberRole
 * for a Member in this List.
 *
 * @param list                          List to be created
 * @param memberRole                    Role the calling User will have for this List
 *
 * @throws BadRequest                   If validation fails
 * @throws Forbidden                    If no User is signed in
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (
    list: Omit<Prisma.ListUncheckedCreateInput, "inviteCode" | "profileId">,
    memberRole: MemberRole
): Promise<List> => {
    logger.info({
        context: "ListActions.insert",
        list: list,
        memberRole: memberRole,
    });
    // TODO - validations!
    const profile = await currentProfile();
    if (!profile) {
        throw new Forbidden(
            "Must be signed in",
            "ListActions.insert",
        );
    }
    try {
        const result = await db.list.create({
            data: {
                ...list,
                inviteCode: uuidv4(),
                profileId: profile.id,
                members: {
                    create: [
                        {profileId: profile.id, role: memberRole},
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
