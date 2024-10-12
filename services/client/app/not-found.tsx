"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Frown, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const pages = [
  { name: "Home", href: "/" },
  { name: "Login", href: "/authentication" },
  { name: "Sign Up", href: "/authentication" },
  { name: "Upload", href: "/dashboard/upload" },
  { name: "Video", href: "/dashboard/video" },
  { name: "About", href: "/about" },
  { name: "Terms", href: "/terms" },
  { name: "Team", href: "/about/team" },
  { name: "Contact", href: "/contact" },
  { name: "Settings", href: "/settings" },
];

export default function NotFound() {
  const [open, setOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const router = useRouter();

  const handleSelect = (href: string) => {
    setSelectedPage(href);
    setOpen(false);
    router.push(href);
  };

  return (
    <div className="flex items-center justify-center w-full p-4">
      <Card className="w-full mx-4 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-6xl font-bold"
            >
              <span className="inline-block animate-pulse">4</span>
              <span className="inline-block animate-bounce mx-1">0</span>
              <span className="inline-block animate-pulse">4</span>
            </motion.div>
          </CardTitle>
          <CardDescription className="text-center text-2xl mt-2">
            Oops! Page not found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center"
          >
            <Frown className="w-24 h-24" />
          </motion.div>
          <p className="text-center">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Try searching for the page you're looking for.
          </p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between"
              >
                {selectedPage
                  ? pages.find((page) => page.href === selectedPage)?.name ||
                    "Search"
                  : "Search"}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-full p-0"
              align={"center"}
              side={"bottom"}
            >
              <Command>
                <CommandInput placeholder="Search pages..." />
                <CommandList>
                  <CommandEmpty>No page found.</CommandEmpty>
                  <CommandGroup>
                    {pages.map((page) => (
                      <CommandItem
                        key={page.href}
                        onSelect={() => handleSelect(page.href)}
                      >
                        {page.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/" passHref>
            <Button variant="default">
              <Home className="w-4 h-4 mr-2" />
              Go back home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
