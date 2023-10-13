// components/shared/UserAvatar.tsx

/**
 * Generic rendering of a user avatar image with standard dimensions
 * by default.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";

// Public Objects ------------------------------------------------------------

interface UserAvatarProps {
    // Optional CSS classes to merge with default ones
    className?: string;
    // URL of the avatar image to be used
    src?: string;
}

export const UserAvatar = (props: UserAvatarProps) => {

    return (
        <Avatar className={cn(
            "h-7 w-7 md:h-10 md:w-10",
            props.className
        )}>
            <AvatarImage src={props.src} />
        </Avatar>
    )

}
