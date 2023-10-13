// components/shared/LoadingSpinner.tsx

/**
 * Generic render of an animated spinner to represent a loading state.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {Icons} from "@/components/layout/Icons";
import {cn} from "@/lib/utils";

// Public Objects -----------------------------------------------------------

interface LoadingSpinnerProps {
    // Optional CSS classes to merge with default ones
    className?: string;
}

export const LoadingSpinner = (props: LoadingSpinnerProps) => {

    return (
        <Icons.Loader className={cn(
            "animate-spin text-zinc-500 ml-auto w-4 h-4",
            props.className
        )}/>
    )

}
