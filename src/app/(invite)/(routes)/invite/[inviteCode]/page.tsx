// app/(invite)/(routes)/invite/[inviteCode]/page.tsx

/**
 * Process the response to an invitation by adding the responding Profile
 * as a Member of the corresponding List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {redirect} from "next/navigation";
import {redirectToSignIn} from "@clerk/nextjs";

// Internal Modules ----------------------------------------------------------

import * as ListActions from "@/actions/ListActions";
import {currentProfile} from "@/lib/clerk";

// Public Objects ------------------------------------------------------------

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
};

const InviteCodePage = async (props: InviteCodePageProps) => {

    const profile = await currentProfile();
    if (!profile) {
        return redirectToSignIn();
    }
    if (!props.params.inviteCode) {
        return redirect("/");
    }

    // If this Profile is already a Member of a List with this invite code,
    // go to that List's page.
    const existingList
        = await ListActions.findByInviteCode(profile.id, props.params.inviteCode);
    if (existingList) {
        return redirect(`/lists/${existingList.id}`);
    }

    // Otherwise, insert this Profile as a new Member, and
    // go to that List's page.  (We are assuming a new GUEST here).
    const updatedList
        = await ListActions.insertMember(profile.id, props.params.inviteCode);
    redirect(`/lists/${updatedList.id}`);

    return null;

}

export default InviteCodePage;
