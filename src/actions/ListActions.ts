"use server"

// actions/ListActions.ts

/**
 * Server side actions for List model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {v4 as uuidv4} from "uuid";
import {List, MemberRole, Prisma} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {db} from "@/lib/db";
import {Forbidden, NotFound, ServerError} from "@/lib/HttpErrors";
import {currentProfile} from "@/lib/clerk";
import logger from "@/lib/ServerLogger";
import {ListWithMembersWithProfiles} from "@/types";
import CategoryUncheckedCreateInput = Prisma.CategoryUncheckedCreateInput;
import {InitialListData} from "@/lib/InitialListData";


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
                    },
                },
            },
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
                    },
                },
            },
            where: {
                id: listId,
                members: {
                    some: {
                        profileId: profileId,
                    },
                },
            },
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

    logger.info({
        context: "ListActions.findByInviteCode",
        profileId: profileId,
        inviteCode: inviteCode,
    });

    try {
        const existingList = await db.list.findFirst({
            where: {
                inviteCode: inviteCode,
                members: {
                    some: {
                        profileId: profileId,
                    },
                },
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
                    ],
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

    logger.info({
        context: "ListActions.insertMember",
        profileId: profileId,
        inviteCode: inviteCode,
        role: role,
    });

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
 * Populate the Categories and Items for this List from the specified
 * InitialListData, erasing any previous Categories and Items first.
 *
 * @param listId                        ID of the List to be populated
 *
 * @throws NotFound                     If the specified List cannot be found
 * @throws ServerError                  If a low level error occurs
 */
export const populate = async (listId: string): Promise<void> => {

    logger.info({
        context: "ListActions.populate",
        listId: listId,
    });

    // TODO - authenticate?
    const list = await db.list.findUnique({
        where: {
            id: listId,
        }
    });
    if (!list) {
        throw new NotFound(
            `listId: Missing List '${listId}'`,
            "ListActions.populate",
        );
    }

    try {

        // Erase all current Items and Categories (via cascade) for this List
        await db.item.deleteMany({
            where: {
                listId: listId,
            }
        });

        // Create each defined Category, keeping them around for access to IDs
        const categories: CategoryUncheckedCreateInput[] = [];
        for (const element of InitialListData) {
            const category = {
                listId: listId,
                name: element[0],
            };
            categories.push(await db.category.create({ data: category }));
        }

        // For each created category, create the relevant Items
        for (let i = 0; i < categories.length; i++)  {
            const element = InitialListData[i];
            if (element.length > 1) {
                for (let j = 1; j < element.length; j++) {
                    await db.item.create({
                        data : {
                            categoryId: categories[i].id!,
                            checked: false,
                            listId: listId,
                            name: element[j],
                            selected: false,
                        },
                    });
                }
            }
        }

    } catch (error) {
        throw new ServerError(
            error as Error,
            "ListActions.populate",
        );
    }

}


/**
 * Remove the specified Member from the specified List.
 * Return the updated List.
 *
 * @param listId                        ID of the List to be updated
 * @param memberId                      ID of the Member to be removed
 */
export const removeMember = async (listId: string, memberId: string): Promise<ListWithMembersWithProfiles> => {

    logger.info({
        context: "ListActions.removeMember",
        listId: listId,
        memberId: memberId,
    });

    const profile = await currentProfile();
    if (!profile) {
        throw new Forbidden(
            "Must be signed in",
            "ListActions.removeMember",
        );
    }
    // TODO - check admin role?

    try {
        const list = await db.list.update({
            data: {
                members: {
                    deleteMany: {
                        id: memberId,
                        profileId: {
                            not: profile.id,
                        },
                    },
                },
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    },
                },
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
            "ListActions.removeMember",
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
export const update = async (listId: string, list: Prisma.ListUpdateInput): Promise<ListWithMembersWithProfiles> => {

    logger.info({
        context: "ListActions.update",
        listId: listId,
        list: list,
    });

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
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    },
                },
            },
            where: {
                id: listId,
                profileId: profile.id,    // TODO - only list creator allowed
            },
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
export const updateInviteCode = async (listId: string): Promise<ListWithMembersWithProfiles> => {

    logger.info({
        context: "ListActions.updateInviteCode",
        listId: listId,
    });

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
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    },
                },
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

/**
 * Update the role for the specified Member of the specified List.
 * Return the updated List.
 *
 * @param listId                        ID of the List to be updated
 * @param memberId                      ID of the Member to be updated
 * @param role                          New MemberRole to be assigned
 */
export const updateMemberRole = async (listId: string, memberId: string, role: MemberRole): Promise<ListWithMembersWithProfiles> => {

    logger.info({
        context: "ListActions.updateMemberRole",
        listId: listId,
        memberId: memberId,
        role: role,
    });

    const profile = await currentProfile();
    if (!profile) {
        throw new Forbidden(
            "Must be signed in",
            "ListActions.updateMemberRole",
        );
    }
    // TODO - check admin role?

    try {
        const list = await db.list.update({
            data: {
                members: {
                    update: {
                        where: {
                            id: memberId,
                            profileId: {
                                not: profile.id, // Disallow accidentally changing owner's own role
                            },
                        },
                        data: {
                            role,
                        },
                    },
                },
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    },
                },
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
            "ListActions.removeMember",
        );
    }

}
