"use client"

// components/lists/ListHeader.tsx

/**
 * Header for ListSidebar.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {MemberRole} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {Icons} from "@/components/layout/Icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ModalType, useModalStore} from "@/hooks/useModalStore";
import {ListWithMembersWithProfiles} from "@/types";

// Public Objects ------------------------------------------------------------

interface ListHeaderProps {
    list: ListWithMembersWithProfiles;
    role?: MemberRole;
}

export const ListHeader = (props: ListHeaderProps) => {

    const {onOpen} = useModalStore();
    const isAdmin = props.role === MemberRole.ADMIN;
    const isGuest = props.role === MemberRole.GUEST;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
                className="focus:outline-none"
            >
                <button
                    className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
                >
                    {props.list.name}
                    <Icons.Down className="h-5 w-5 ml-auto"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
            >
                {isAdmin && (
                    <DropdownMenuItem
                        className="px-3 py-2 text-sm cursor-pointer"
                        onClick={() => onOpen(ModalType.LIST_EDIT, { list: props.list })}
                    >
                        Edit Settings
                        <Icons.Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                        onClick={() => onOpen(ModalType.LIST_INVITE, { list: props.list })}
                    >
                        Invite People
                        <Icons.UserPlus className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen(ModalType.LIST_MEMBERS, { list: props.list })}
                        className="px-3 py-2 text-sm cursor-pointer"
                    >
                        Manage Members
                        <Icons.Users className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuSeparator/>
                )}
                {!isAdmin && (
                    <DropdownMenuItem
                        className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                        onClick={() => onOpen(ModalType.LIST_LEAVE, { list: props.list })}
                    >
                        Leave List
                        <Icons.Leave className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen(ModalType.LIST_REMOVE, { list: props.list })}
                        className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                    >
                        Remove List
                        <Icons.Remove className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )

}
