import React from "react";
import { SettingsProvider } from "@/context/settings-provider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SettingsProvider>
      <div className="flex flex-row flex-1 w-full min-h-screen bg-background py-8">
        <div className="flex-1">{children}</div>
      </div>
    </SettingsProvider>
  );
}
