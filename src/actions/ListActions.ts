"use server"

// actions/ListActions.ts

/**
 * Server side actions for List model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {v4 as uuidv4} from "uuid";
import {List, MemberRole, Prisma, Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {db} from "@/lib/db";
import {BadRequest, Forbidden, NotFound, NotUnique, ServerError} from "@/lib/HttpErrors";
import {currentProfile} from "@/lib/clerk";
import logger from "@/lib/ServerLogger";


// Public Objects ------------------------------------------------------------

/**
 * Return all Lists that the specified Profile is a Member of,
 * in ascending order by name.
 *
 * @param profile                       Profile of the requesting User.
 */
export const all = async (profile: Profile): Promise<List[]> => {

    const lists = await db.list.findMany({
        orderBy: [
            { name: "asc" },
        ],
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
                        {profileId: profile.id, role: memberRole}
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
