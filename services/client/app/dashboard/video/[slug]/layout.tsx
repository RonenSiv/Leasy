// components/VideoPageLayout.tsx
import React from "react";

interface VideoPageLayoutProps {
    children: React.ReactNode;
}

export default function VideoPageLayout({ children }: VideoPageLayoutProps) {
    return (
        <div className="container mx-auto p-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 min-h-screen text-foreground">
            {children}
        </div>
    );
}
