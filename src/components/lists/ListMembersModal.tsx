"use client"

// components/lists/ListMembersModal.tsx

/**
 * Manage members for the specified List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";
import {useState} from "react";
import {MemberRole} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as ListActions from "@/actions/ListActions";
import {Icons} from "@/components/layout/Icons";
import {LoadingSpinner} from "@/components/shared/LoadingSpinner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/shared/UserAvatar";
import {ModalType, useModalStore} from "@/hooks/useModalStore";
import {ListWithMembersWithProfiles} from "@/types";

// Public Objects ------------------------------------------------------------

const roleIconMap: Map<MemberRole, JSX.Element> = new Map();
roleIconMap.set(MemberRole.ADMIN, <Icons.Admin className="h-4 w-4 ml-2 text-rose-500"/>);
roleIconMap.set(MemberRole.GUEST, <Icons.Guest className="h-4 w-4 ml-2"/>);

export const ListMembersModal = () => {

    const {data, isOpen, onClose, onOpen, type} = useModalStore();
    const [loadingId, setLoadingId] = useState<string>("");
    const router = useRouter();
    const isModalOpen = isOpen && type === ModalType.LIST_MEMBERS;
    const {list} = data as {list: ListWithMembersWithProfiles};

    // Handle a command to remove a Profile from this List
    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const updatedList: ListWithMembersWithProfiles =
                await ListActions.removeMember(list.id, memberId);
            router.refresh();
            onOpen(ModalType.LIST_MEMBERS, {list: updatedList});
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId("");
        }
    }

    // Handle a command to change the role of a particular Member
    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);
            const updatedList: ListWithMembersWithProfiles =
                await ListActions.updateMemberRole(list.id, memberId, role);
            router.refresh();
            onOpen(ModalType.LIST_MEMBERS, {list: updatedList});
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId("");
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage List Members
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {list?.members?.length} Member(s)
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {list?.members?.map((member) => (
                        <div className="flex items-center gap-x-2 mb-6" key={member.id}>
                            <UserAvatar src={member.profile.imageUrl}/>
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {member.profile.name}
                                    {roleIconMap.get(member.role)}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member.profile.email}
                                </p>
                            </div>
                            {list.profileId !== member.profileId && loadingId !== member.id && (
                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <Icons.MoreVertical className="h-4 w-4 text-zinc-500"/>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="flex items-center">
                                                    <Icons.ShieldQuestion className="w-4 h-4 mr-2"/>
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem
                                                            onClick={() => onRoleChange(member.id, "GUEST")}
                                                        >
                                                            <Icons.Guest className="h-4 w-4 mr-2" />
                                                            Guest
                                                            {member.role === "GUEST" && (
                                                                <Icons.Check className="h-4 w-4 ml-auto"/>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => onRoleChange(member.id, "ADMIN")}
                                                        >
                                                            <Icons.Admin className="h-4 w-4 mr-2 text-rose-500" />
                                                            Admin
                                                            {member.role === "ADMIN" && (
                                                                <Icons.Check className="h-4 w-4 ml-auto"/>
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem
                                                onClick={() => onKick(member.id)}
                                            >
                                                <Icons.Kick className="h-4 w-4 mr-2" />
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <LoadingSpinner/>
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )

}
