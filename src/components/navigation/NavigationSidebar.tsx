// components/navigation/NavigationSidebar.tsx

/**
 * Sidebar for pages under the (main) layout.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {redirect} from "next/navigation";
import {UserButton} from "@clerk/nextjs";

// Internal Modules ----------------------------------------------------------

import * as ListActions from "@/actions/ListActions";
import {ModeToggle} from "@/components/layout/ModeToggle";
import {NavigationAction} from "@/components/navigation/NavigationAction";
import {NavigationItem} from "@/components/navigation/NavigationItem";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {currentProfile} from "@/lib/clerk";

// Public Objects ------------------------------------------------------------

export const NavigationSidebar =  async () => {

    const profile = await currentProfile();
    if (!profile) {
        return redirect("/");
    }
    const lists = await ListActions.all(profile.id);

    return (
        <div className="space-y-4 flex flex-col items-center h-full w-full dark:bg-[#1E1F22] bg-[#E3E5E8] dark:text-zinc-100">
            <NavigationAction/>
            <Separator className="h-[2px] bg-yellow-300 dark:bg-yellow-500 rounded-md w-10 mx-auto"/>
            <ScrollArea className="flex-1 w-full mb-4">
                {lists.map((list) => (
                    <div key={list.id} className="mb-4">
                        <NavigationItem id={list.id} name={list.name}/>
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <Separator className="h-[2px] bg-yellow-300 dark:bg-yellow-500 rounded-md w-10 mx-auto"/>
                <ModeToggle/>
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-[48px] w-[48px]"
                        }
                    }}
                />
            </div>
        </div>
    )

}
