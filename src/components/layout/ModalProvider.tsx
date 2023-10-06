"use client"
// components/layout/ModalProvider.tsx

/**
 * Component to work around hydration errors on modal components by
 * deferring navigation on them as needed.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

// TODO - imports of components that are modals go here

// Public Objects ------------------------------------------------------------

export const ModalProvider = () => {

    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <>
            {/* TODO - instantiations of components that are modal go here */}
        </>
    )

}
