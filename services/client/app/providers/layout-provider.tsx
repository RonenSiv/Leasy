"use client";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { SettingsProvider } from "@/context/settings-context";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import React from "react";
import { SWRConfig } from "swr";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SWRConfig
        value={{
          revalidateOnFocus: true,
          revalidateOnReconnect: true,
        }}
      >
        <SettingsProvider>
          {children}
          <ProgressBar
            height="2px"
            color="#3AD0EE"
            options={{ showSpinner: true }}
            shallowRouting
          />
        </SettingsProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
