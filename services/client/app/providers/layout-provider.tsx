"use client";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { SettingsProvider } from "@/context/settings-context";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import React from "react";
import { SWRConfig } from "swr";
import { AuthProvider } from "@/context/auth-context";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SWRConfig>
        <AuthProvider>
          <SettingsProvider>
            {children}
            <ProgressBar
              height="2px"
              color="#3AD0EE"
              options={{ showSpinner: true }}
              shallowRouting
            />
          </SettingsProvider>
        </AuthProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
