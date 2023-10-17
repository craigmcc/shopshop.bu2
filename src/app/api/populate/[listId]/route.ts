// api/populate/[listId]/route.ts

/**
 * Temporary API to populate Categories and Items for an existing List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import * as ListActions from "@/actions/ListActions";
import {NextResponse} from "next/server";

// Public Objects ------------------------------------------------------------

export async function POST(
    request: Request,
    { params }: { params: {listId: string}}
) {

    try {
        await ListActions.populate(params.listId);
        return NextResponse.json({message: "Populate was successful" , status: 200});
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message, status: 500 });
    }

}
