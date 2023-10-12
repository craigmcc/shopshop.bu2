"use client"

// components/lists/ListInsertModal.tsx

/**
 * Initial version of a "create list" modal.  Will get replaced later.
 * The tutorial created a Server, but we are creating a List.
 * We also use a server action instead of an API POST.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
//import {v4 as uuidv4} from "uuid";
import * as z from "zod";
//import {useAuth} from "@clerk/nextjs";
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
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {ModalType, useModalStore} from "@/hooks/useModalStore";

// Public Objects ------------------------------------------------------------

export const ListInsertModal = (/*props: ListCreateModalProps*/) => {

    const {isOpen, onClose, type} = useModalStore();
    const router = useRouter();
    const isModalOpen = isOpen && type === ModalType.LIST_INSERT;

    const formSchema = z.object({
        name: z.string().min(1, {
            message: "List name is required",
        }),
    });

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
            onClose();
        } catch (error) {
            console.log(error); // TODO - better handling
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog onOpenChange={handleClose} open={isModalOpen}>
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
