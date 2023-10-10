"use client"

// components/lists/ListNavigationItem.tsx

/**
 * Individual navigation link for NavigationSidebar.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Image from "next/image";
import {useRouter} from "next/navigation";

// Internal Modules ----------------------------------------------------------

import {ActionTooltip} from "@/components/shared/ActionTooltip";
import {ModalType} from "@/hooks/useModalStore";
import {Icons} from "@/components/layout/Icons";

// Public Objects ------------------------------------------------------------

interface ListNavigationItemProps {
    id: string,
//    imageUrl: string;
    name: string;
}

export const ListNavigationItem = (props: ListNavigationItemProps) => {

    const router = useRouter();

    const initials = (name: string): string => {
        let result: string = "";
        const words = name.split(" ");
        for (const word of words) {
            result += word.substring(0, 1).toUpperCase();
        }
        return result;
    }

    const onClick = () => {
        router.push(`/lists/${props.id}`);
    }

    return (
        <ActionTooltip
            align="center"
            label={props.name}
            side="right"
        >
            <button
                className="group flex items-center"
                onClick={onClick}
            >
                <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-indigo-300 dark:bg-neutral-700 group-hover:bg-emerald-500">
                    {initials(props.name)}
                </div>
            </button>
        </ActionTooltip>
    )

}
