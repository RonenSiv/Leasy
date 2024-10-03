import React, { Suspense } from "react";
import { Progress } from "@/components/progress";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar/navbar";
import { GradientCircle } from "@/components/ui/gradient-circle";
import { Footer } from "@/components/footer/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AI } from "@/lib/chat/actions";
import { Toaster } from "sonner";
import { ClientProvider } from "@/providers/client-provider";
import { BodyProvider } from "@/providers/body-provider";

interface LayoutProviderProps {
  children: React.ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  return (
    <BodyProvider>
      <ThemeProvider attribute="class">
        <TooltipProvider>
          <ClientProvider>
            <Toaster position="bottom-right" richColors />
            <AI>
              <Suspense>
                <Progress />
              </Suspense>
              <GradientCircle
                dimensions={500}
                position={{ x: "-3%", y: "60%" }}
                duration={15}
              />
              <GradientCircle
                dimensions={1100}
                position={{ x: "40%", y: "-50%" }}
                duration={25}
                reverse
              />
              <div
                className="flex flex-col items-center justify-start relative custom-scrollbar h-full md:px-15"
                style={{
                  minHeight: "100vh",
                }}
              >
                <header
                  className={"w-full top-0 z-50 max-w-screen-xl px-4"}
                  style={{
                    zIndex: 1000,
                  }}
                >
                  <Navbar />
                </header>
                <main className="flex flex-col items-center justify-center w-full flex-1 max-w-screen-xl py-4">
                  {children}
                </main>

                <footer className={"z-50 w-full max-w-screen-xl px-4"}>
                  <Footer />
                </footer>
              </div>
            </AI>
          </ClientProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BodyProvider>
  );
};
