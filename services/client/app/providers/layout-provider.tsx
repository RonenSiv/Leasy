"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { SettingsProvider } from "@/context/settings-context";
import { ClientProvider } from "@/app/providers/client-provider";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClientProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SettingsProvider>
          {children}
          <ProgressBar
            height="2px"
            color="#3AD0EE"
            options={{ showSpinner: true }}
            shallowRouting
          />
        </SettingsProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </ClientProvider>
  );
}
