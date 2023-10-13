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
 * Find and return the List, where the specified Profile is a Member, and the
 * specified invite code is present.  If not found, return null
 *
 * @param profileId                     ID of the proposed Profile
 * @param inviteCode                    The specified invite code
 *
 * @throws ServerError                  If some other error occurs
 */
export const findByInviteCode = async (profileId: string, inviteCode: string): Promise<List | null> =>  {

    try {
        const existingList = await db.list.findFirst({
            where: {
                inviteCode: inviteCode,
                members: {
                    some: {
                        profileId: profileId,
                    }
                }
            },
        });
        return existingList;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "ListActions.findByInviteCode",
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

/**
 * Insert a new Member (as a MemberRole.GUEST) based on an invite code.
 * Return the updated List.
 *
 * @param profileId                     ID of the Profile to be added
 * @param inviteCode                    The specified invite code
 * @param role                          Role of the new Member [GUEST]
 *
 * @throws ServerError                  If some other error occurs
 */
export const insertMember =
    async (profileId: string, inviteCode: string, role: MemberRole = MemberRole.GUEST): Promise<List> => {

    try {
        const list = await db.list.update({
            data: {
                members: {
                    create: [
                        { profileId: profileId, role: role }
                    ],
                },
            },
            where: {
                inviteCode: inviteCode,
            },
        });
        return list;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "ListActions.insertMember",
        );
    }

}

/**
 * Update the specified List with the specified new data.
 *
 * @param listId                        ID of the List being updated
 * @param list                          Data for the updates to this List
 *
 * @throws Forbidden                    If no User is signed in
 * @throws ServerError                  If some other error occurs
 */
export const update = async (listId: string, list: Prisma.ListUpdateInput): Promise<List> => {

    const profile = await currentProfile();
    if (!profile) {
        throw new Forbidden(
            "Must be signed in",
            "ListActions.updateInviteCode",
        );
    }
    // TODO - check admin role?

    try {
        const result = db.list.update({
            data: list,
            where: {
                id: listId,
                profileId: profile.id,    // TODO - only list creator allowed
            }
        });
        return result;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "ListActions.update",
        );
    }

}


/**
 * Generate a new inviteCode and return the updated List.
 *
 * @param listId                        ID of the list being invited to
 *
 * @throws Forbidden                    If no User is signed in
 * @throws ServerError                  If some other error occurs
 */
export const updateInviteCode = async (listId: string): Promise<List> => {

    const profile = await currentProfile();
    if (!profile) {
        throw new Forbidden(
            "Must be signed in",
            "ListActions.updateInviteCode",
        );
    }

    try {
        const list = await db.list.update({
            data: {
              inviteCode: uuidv4(),
            },
            where: {
                id: listId,
                profileId: profile.id,
            },
        });
        return list;
    } catch (error) {
        throw new ServerError(
            error as Error,
            "ListActions.updateInviteCode",
        );
    }

}
