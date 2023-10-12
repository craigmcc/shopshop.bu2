// hooks/useOrigin.tsx

/**
 * Return the "origin" URL from browser globals.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const useOrigin = () => {

    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

    if (mounted) {
        return origin;
    } else {
        return "";
    }

}
