"use client"
// components/layout/ModalProvider.tsx

/**
 * Component to work around hydration errors on modal components by
 * deferring navigation on them as needed.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {redirect} from "next/navigation";
import {useEffect, useState} from "react";
import {useAuth} from "@clerk/nextjs";
import {Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as ProfileActions from "@/actions/ProfileActions";
// TODO - imports of components that are modals go here
import {ListCreateModal} from "@/components/lists/ListCreateModal";

// Public Objects ------------------------------------------------------------

export const ModalProvider = () => {

    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [profile, setProfile] = useState<Profile | null>(null);

    const {userId} = useAuth();
    if (!userId) {
        redirect("/");
    }
    useEffect(() => {
        const lookupProfile = async () => {
            const theProfile = await ProfileActions.findByUserId(userId);
            setProfile(profile);
        }
        lookupProfile();
        setIsMounted(true);
    }, [])

    if (!isMounted || !profile) {
        return null;
    }

    return (
        <>
            {/* TODO - instantiations of components that are modal go here */}
            <ListCreateModal profile={profile!}/>
        </>
    )

}
