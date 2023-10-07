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

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Identifiers for the modals that can be managed.
 */
export enum ModalType {
    CREATE_LIST = "CreateList",
}

/**
 * Various data items that might be associated with a particular modal.
 */
interface ModalData {
    // Data models
    list?: List,
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
    onOpen: (type, data = {}) => set({isOpen: true, type, data}),
    type: null,
}));

