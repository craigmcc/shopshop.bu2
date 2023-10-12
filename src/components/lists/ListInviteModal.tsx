"use client"

// components/lists/ListInviteModal.tsx

/**
 * Modal to send an invitation (to join a List) to a particular Profile.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useState} from "react";
import {List} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as ListActions from "@/actions/ListActions";
import {Icons} from "@/components/layout/Icons";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {ModalType, useModalStore} from "@/hooks/useModalStore";
import {useOrigin} from "@/hooks/useOrigin";

// Public Objects ------------------------------------------------------------

export const ListInviteModal = () => {

    const {data, isOpen, onClose, onOpen, type} = useModalStore();
    const origin = useOrigin();
    const isModalOpen = isOpen && type === ModalType.LIST_INVITE;
    const {list} = data;
    const inviteUrl = `${origin}/invite/${list?.inviteCode}`;

    const [copied, setCopied] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Copy the invite URL to the clipboard
    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }

    // Generate a new invite code (for use in inviting someone else later)
    const onNew = async (list: List) => {
        try {
            setIsLoading(true);
            const updatedList =
                await ListActions.updateInviteCode(list.id);
            onOpen(ModalType.LIST_INVITE, { list: updatedList });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label
                        className="text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                        List invite link
                    </Label>
                    <div className={"flex items-center mt-2 gap-x-2"}>
                        <Input
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offet-0"
                            disabled={isLoading}
                            value={inviteUrl}
                        />
                        <Button disabled={isLoading} onClick={onCopy} size="icon">
                            {copied
                                ? <Icons.Check className="w-4 h-4" />
                                : <Icons.Copy className="w-4 h-4" />
                            }
                        </Button>
                    </div>
                    <Button
                        className="text-xs text-zinc-500 mt-4"
                        disabled={isLoading}
                        onClick={() => onNew(list!)}
                        size="sm"
                        variant="link"
                    >
                        Generate a new link
                        <Icons.Refresh className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )

}
