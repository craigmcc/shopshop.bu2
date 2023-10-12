"use client"
// components/layout/ModalProvider.tsx

/**
 * Component to work around hydration errors on modal components by
 * deferring navigation on them as needed.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {redirect} from "next/navigation";
import {useEffect, useState} from "react";
import {useAuth} from "@clerk/nextjs";

// Internal Modules ----------------------------------------------------------

// TODO - imports of components that are modals go here
import {ListInsertModal} from "@/components/lists/ListInsertModal";

// Public Objects ------------------------------------------------------------

export const ModalProvider = () => {

    const [isMounted, setIsMounted] = useState<boolean>(false);
    const {userId} = useAuth();
    if (!userId) {
        redirect("/");
    }

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <>
            {/* TODO - instantiations of components that are modal go here */}
            <ListInsertModal/>
        </>
    )

}
