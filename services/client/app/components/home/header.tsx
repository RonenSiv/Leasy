"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserSidebar } from "../user-sidebar";
import { useSettings } from "@/context/settings-context";

const Header = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { reduceMotion } = useSettings();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY) {
          // if scroll down hide the navbar
          setIsVisible(false);
        } else {
          // if scroll up show the navbar
          setIsVisible(true);
        }

        // remember current page location to use in the next move
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  const navItems = user
    ? [
        { href: "/", label: "Home", ariaLabel: "Go to home page" },
        { href: "/browse", label: "Browse", ariaLabel: "Browse videos" },
        { href: "/upload", label: "Upload", ariaLabel: "Upload a new video" },
        {
          href: "/features",
          label: "Features",
          ariaLabel: "View Leasy features",
        },
        {
          href: "/showcase",
          label: "Feature Showcase",
          ariaLabel: "View feature showcase",
        },
        { href: "/about", label: "About", ariaLabel: "Learn about Leasy" },
      ]
    : [
        { href: "/", label: "Home", ariaLabel: "Go to home page" },
        {
          href: "/features",
          label: "Features",
          ariaLabel: "View Leasy features",
        },
        {
          href: "/showcase",
          label: "Feature Showcase",
          ariaLabel: "View feature showcase",
        },
        { href: "/about", label: "About", ariaLabel: "Learn about Leasy" },
      ];

  return (
    <motion.header
      className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50"
      initial={{ top: 0 }}
      animate={{ top: isVisible ? 0 : "-100%" }}
      transition={{ duration: reduceMotion ? 0 : 0.3 }}
    >
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              href="/services/client/public"
              className="text-2xl font-bold text-primary"
            >
              Leasy
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.ariaLabel}
                  className={`text-sm ${
                    pathname === item.href
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {mounted &&
                (theme === "light" ? <Moon size={20} /> : <Sun size={20} />)}
            </Button>

            {user ? (
              <UserSidebar />
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            )}

            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu size={24} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-label={item.ariaLabel}
                        className={`block py-2 ${
                          pathname === item.href
                            ? "text-primary font-semibold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    {!user && (
                      <div className="pt-4 space-y-2">
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/login">Sign in</Link>
                        </Button>
                        <Button className="w-full" asChild>
                          <Link href="/signup">Sign up</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
