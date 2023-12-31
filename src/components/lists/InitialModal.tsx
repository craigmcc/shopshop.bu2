"use client"

// components/lists/InitialModal.tsx

/**
 * Initial version of a "create list" modal.  Will get replaced later.
 * The tutorial created a Server, but we are creating a List.
 * We also use a server action instead of an API POST.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {useAuth} from "@clerk/nextjs";
import {zodResolver} from "@hookform/resolvers/zod";
import {MemberRole, Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as ListActions from "@/actions/ListActions";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Public Objects ------------------------------------------------------------

type InitialModalProps = {
    // Profile of the signed-in User
    profile: Profile;
}

export const InitialModal = (props: InitialModalProps) => {

    const [isMounted, setIsMounted] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const {userId} = useAuth();

    const formSchema = z.object({
        name: z.string().min(1, {
            message: "List name is required",
        }),
        inviteCode: z.string().min(1, {
            message: "Invite Code is required",
        }),
/*
        profileId: z.string().min(1, {
            message: "Profile ID is required",
        }),
*/
    })

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            name: "",
        },
        mode: "onBlur",
        resolver: zodResolver(formSchema)
    });
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await ListActions.insert(
                values,
                MemberRole.ADMIN,
            );
            form.reset();
            router.refresh();
            window.location.reload(); // TODO - likely different later
        } catch (error) {
            console.log(error); // TODO - better handling
        }
    }

    if (!isMounted) {
        return null;
    }

    return (
        <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create New List
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Create your first shopping list
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Shopping List Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                autoFocus
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter shopping list name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="default" disabled={isLoading}>
                                Save
                            </Button>
                        </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )

}
