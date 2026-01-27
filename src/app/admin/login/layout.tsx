import React from 'react';

// This layout bypasses the admin layout to show ONLY the login page
export default function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
