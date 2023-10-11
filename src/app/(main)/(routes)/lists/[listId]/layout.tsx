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

import * as ListActions from "@/actions/ListActions";
import {currentProfile} from "@/lib/clerk";
import logger from "@/lib/ServerLogger";

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

    const list = await ListActions.find(profile.id, props.params.listId);
    if (!list) {
        return redirect("/");
    }

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                Member Sidebar
            </div>
            <main className="h-full md:pl-60">
                {props.children}
            </main>
        </div>
    )
}

export default ListIdLayout;
