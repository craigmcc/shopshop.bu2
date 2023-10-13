// hooks/useModalStore.ts

/**
 * Zustand-based store for managing opening of modals.
 *
 * Based on "hooks/use-modal-store.ts" from
 * https://github.com/AntonioErdeljac/next13-discord-clone.git
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {create} from "zustand";
import {
    List,
    Member,
    MemberRole,
    Profile,
} from "@prisma/client";
import {ListWithMembersWithProfiles} from "@/types";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Identifiers for the modals that can be managed.
 */
export enum ModalType {
    LIST_EDIT = "ListEdit",
    LIST_INSERT = "ListInsert",
    LIST_INVITE = "ListInvite",
    LIST_LEAVE = "ListLeave",
    LIST_MEMBERS = "ListMembers",
    LIST_REMOVE = "ListRemove",
}

/**
 * Various data items that might be associated with a particular modal.
 */
interface ModalData {
    // Data models
    list?: ListWithMembersWithProfiles,
    member?: Member,
    memberRole?: MemberRole,
    profile?: Profile,
    // Generic properties
    apiUrl?: string;
    query?: Record<string, any>;
}

/**
 * Contents of a store for a modal.
 */
interface ModalStore {
    data: ModalData;
    isOpen: boolean;
    onClose: () => void;
    onOpen: (type: ModalType, data?: ModalData) => void;
    type: ModalType | null;
}

/**
 * Hook-like declaration of a modal store.
 */
export const useModalStore = create<ModalStore>((set) => ({
    data: {},
    isOpen: false,
    onClose: () => set({type: null, isOpen: false}),
    onOpen: (type, data = {}) => {
        console.log(`useModalStore.onOpen, type=${type}, data=${JSON.stringify(data)}`);
        set({isOpen: true, type, data});
    },
    type: null,
}));

