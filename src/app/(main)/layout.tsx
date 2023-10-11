// app/(main)/layout.tsx

/**
 * Overall layout for pages in the (main) route group.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {NavigationSidebar} from "@/components/navigation/NavigationSidebar";

// Public Objects ------------------------------------------------------------

const MainLayout = async({
    children
}: {
    children: React.ReactNode;
}) => {

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar/>
            </div>
            <main className="md:pl-[72px] h-full">
                {children}
            </main>
        </div>

    )

}

export default MainLayout;
