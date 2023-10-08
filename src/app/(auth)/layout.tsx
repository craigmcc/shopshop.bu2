// app/(auth)/layout.tsx

/**
 * Layout for the (auth) route group.
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

const AuthLayout = ({children}: {children: React.ReactNode}) => {

    return (
        <div className="h-full flex items-center justify-center">
            {children}
        </div>
    )

}

export default AuthLayout;
