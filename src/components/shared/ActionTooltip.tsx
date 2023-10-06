"use client"
// components/shared/ActionTooltip.tsx

/**
 * Tooltip surrounding the passed children, with convenient
 * formatting props.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Public Objects ------------------------------------------------------------

interface ActionTooltipProps {
    // Preferred alignment against the trigger [center]
    align?: "center" | "end" | "start";
    // Content to be rendered as the trigger for this action
    children: React.ReactNode;
    // Duration from when the mouse enters the tooltip trigger until the tooltip opens [50]
    delayDuration?: number;
    // Textual label for this action
    label: string;
    // Preferred side of the trigger to render against when open [top]
    side?: "bottom" | "left" | "right" | "top";
}

export const ActionTooltip = (props: ActionTooltipProps) => {

    return (
        <TooltipProvider>
            <Tooltip
                delayDuration={props.delayDuration ? props.delayDuration : 50}
            >
                <TooltipTrigger asChild>
                    {props.children}
                </TooltipTrigger>
                <TooltipContent
                    align={props.align}
                    side={props.side}
                >
                    <p className="font-semibold text-sm">
                        {props.label}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )

}
