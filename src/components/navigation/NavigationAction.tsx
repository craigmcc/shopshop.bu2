"use client"

// components/navigation/NavigationAction.tsx

/**
 * Action element that triggers opening the "Create List" modal.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {Icons} from "@/components/layout/Icons";
import {ActionTooltip} from "@/components/shared/ActionTooltip";
import {ModalType, useModalStore} from "@/hooks/useModalStore";

// Public Objects ------------------------------------------------------------

export const NavigationAction = () => {

    const {onOpen} = useModalStore();

    return (
        <div>
            <ActionTooltip
                align="center"
                label="Add a List"
                side="right"
            >
                <button
                    className="group flex items-center"
                    onClick={() => onOpen(ModalType.LIST_CREATE)}
                >
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-indigo-400 dark:bg-neutral-700 group-hover:bg-emerald-500">
                        <Icons.Add
                            className="group-hover:text-white transition text-emerald-500"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )


}
