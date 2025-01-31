import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import { Header } from "./components/header/header";
import { Toaster } from "react-hot-toast";
import ScrollToTopButton from "./components/home/scroll-to-button";
import { PageTransition } from "./components/page-transition";
import Footer from "./components/footer";
import { LayoutProvider } from "./providers/layout-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-main" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
});

export const metadata = {
  title: "Leasy - Learning Made Easy",
  description: "Enhance your learning experience with video content tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground flex flex-col min-h-screen">
        <LayoutProvider>
          <PageTransition />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ScrollToTopButton />
          <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
        </LayoutProvider>
      </body>
    </html>
  );
}
