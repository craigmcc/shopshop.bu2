// types.ts

/**
 * Global types for this application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {List, Member, Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export type ListWithMembersWithProfiles = List & {members: MemberWithProfile[]}
export type MemberWithProfile = Member & {profile: Profile};
