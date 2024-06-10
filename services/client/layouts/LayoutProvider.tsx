import React, { Suspense } from "react";
import Progress from "@/app/components/ui/Progress";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/app/components/Navbar/Navbar";
import { GradientCircle } from "@/app/components/ui/GradientCircle";
import { Footer } from "@/components/footer/Footer";

interface LayoutProviderProps {
  children: React.ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  return (
    <ThemeProvider attribute="class">
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
        <header className={"w-full top-0 z-50 max-w-screen-xl px-4"}>
          <Navbar />
        </header>
        <main className="flex flex-col items-center justify-center w-full flex-1 max-w-screen-xl p-4">
          {children}
        </main>
        <footer className={"w-full z-50 max-w-screen-xl px-4"}>
          <Footer />
        </footer>
      </div>
    </ThemeProvider>
  );
};
