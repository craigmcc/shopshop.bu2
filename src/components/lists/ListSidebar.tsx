// components/lists/ListSidebar.tsx

/**
 * Sidebar for an individual List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {redirect} from "next/navigation";

// Internal Modules ----------------------------------------------------------

import * as ListActions from "@/actions/ListActions";
import {ListHeader} from "@/components/lists/ListHeader";
import {currentProfile} from "@/lib/clerk";
import logger from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

interface ListSidebarProps {
    listId: string;
}
export const ListSidebar = async (props: ListSidebarProps) => {

    const profile = await currentProfile();
    if (!profile) {
        return redirect("/");
    }

    const list = await ListActions.find(profile.id, props.listId);
    if (!list) {
        return redirect("/");
    }
/*
    logger.info({
        context: "ListSidebar.list",
        list: list,
    });
*/
    const members =
        list.members.filter((member) => member.profileId !== profile.id);
    const role =
        list.members.find((member) => member.profileId === profile.id)?.role;

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ListHeader
                list={list}
                role={role}
            />
        </div>
    )

}
