"use client"

// components/lists/ListEditModal.tsx

/**
 * Edit settings for the specified List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

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
import {Input} from "@/components/ui/input";
import {ModalType, useModalStore} from "@/hooks/useModalStore";

// Public Objects ------------------------------------------------------------

export const ListEditModal = () => {

    const {data, isOpen, onClose, type} = useModalStore();
    const router = useRouter();
    const isModalOpen = isOpen && type === ModalType.LIST_EDIT;
    const {list} = data;

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
        resolver: zodResolver(formSchema),
    });
    const isLoading = form.formState.isSubmitting;

    useEffect(() => {
        if (list) {
            form.setValue("name", list.name);
        }
    }, [form, list]);

    const handleClose = () => {
        form.reset();
        onClose();
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await ListActions.update(list!.id, values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Edit List Settings
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Update the settings for this List.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="y-8 px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            List Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter list name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )

}
