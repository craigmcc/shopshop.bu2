// components/layout/TopBar.tsx

/**
 * Top-of-page bar for the global layout.
 *
 * @packageNavigation
 */

// External Modules ----------------------------------------------------------

import Link from "next/link";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
} from "@clerk/nextjs";

// Internal Modules ----------------------------------------------------------

import {Icons} from "@/components/layout/Icons";
import {ModeToggle} from "@/components/layout/ModeToggle";

// Public Objects ------------------------------------------------------------

export const TopBar = () => {

    return (
        <header className="bg-indigo-100 dark:bg-indigo-800 flex p-2 w-full">
            <div>
                <Link href="/" className="flex items-center space-x-2">
                    <Icons.ShoppingCart className="h-8 w-8"/>
                    <span className="inline-block font-bold">
                        ShopShop
                    </span>
                </Link>
            </div>
            <div className="flex flex-1 px-2 items-center">
                <ModeToggle/>
            </div>
            <div className="flex flex-1 items-center justify-end">
                <SignedIn>
                    <UserButton showName/>
                </SignedIn>
                <SignedOut>
                    <SignInButton/>
                </SignedOut>
            </div>
        </header>
    )

}
