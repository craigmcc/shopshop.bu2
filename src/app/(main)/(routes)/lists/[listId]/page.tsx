// app/(main)/(routes)/lists/[listId]/page.tsx

/**
 * Main page for a specific List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {redirect} from "next/navigation";
import {redirectToSignIn} from "@clerk/nextjs";

// Internal Modules ----------------------------------------------------------

import {currentProfile} from "@/lib/clerk";
import {db} from "@/lib/db";

// Public Objects ------------------------------------------------------------

interface ListIdPageParams {
    params: {
        listId: string
    }
}

const ListIdPage = async ({
    params
}: ListIdPageParams) => {


    return <div>ListIdPage for List {params.listId}</div>
}

export default ListIdPage;
