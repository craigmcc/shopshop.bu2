// app/(main)/(routes)/lists/[listId]/layout.tsx

/**
 * Layout for a specific List home page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {redirect} from "next/navigation";
import {redirectToSignIn} from "@clerk/nextjs";

// Internal Modules ----------------------------------------------------------

import {ListSidebar} from "@/components/lists/ListSidebar";
import {currentProfile} from "@/lib/clerk";

// Public Objects ------------------------------------------------------------

interface ListIdLayoutProps {
    children: React.ReactNode;
    params: {listId: string};
}

const ListIdLayout = async (props: ListIdLayoutProps) => {

    const profile = await currentProfile();
    if (!profile) {
        return redirectToSignIn();
    }


    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ListSidebar listId={props.params.listId}/>
            </div>
            <main className="h-full md:pl-60">
                {props.children}
            </main>
        </div>
    )
}

export default ListIdLayout;
