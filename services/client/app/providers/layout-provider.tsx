"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { SettingsProvider } from "@/context/settings-context";
import { ClientProvider } from "@/app/providers/client-provider";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClientProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SettingsProvider>{children}</SettingsProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </ClientProvider>
  );
}
