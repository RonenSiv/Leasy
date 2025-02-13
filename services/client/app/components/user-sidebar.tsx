"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  FileText,
  HelpCircle,
  Layout,
  LogOut,
  Settings,
  Star,
  User,
  Video,
} from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/app/components/spinner";
import { useAuth } from "@/context/auth-context";

export function UserSidebar() {
  const { logout, isLoading, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase();
  };

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    setIsOpen(false);
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <SheetHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">{user.full_name}</span>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-4">
            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <User size={16} />
                <span>Your dashboard</span>
              </Link>
              <Link
                href="/browse"
                className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <Video size={16} />
                <span>Your videos</span>
              </Link>
            </div>

            <Separator />

            <div className="space-y-1">
              <Link
                href="/upload"
                className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <Layout size={16} />
                <span>Upload video</span>
              </Link>
              <Link
                href="/favorites"
                className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <Star size={16} />
                <span>Saved videos</span>
              </Link>
            </div>

            <Separator />

            <div className="space-y-1">
              <Link
                href="/settings"
                className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={16} />
                <span>Settings</span>
              </Link>
              <Link
                href="/docs"
                className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <FileText size={16} />
                <span>Documentation</span>
              </Link>
            </div>

            <Separator />

            <div className="space-y-1">
              <Link
                href="/about"
                className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <BookOpen size={16} />
                <span>About Leasy</span>
              </Link>
              <Link
                href="/support"
                className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <HelpCircle size={16} />
                <span>Support</span>
              </Link>
            </div>

            <Separator />

            <Button
              variant="destructive"
              className="w-full justify-start gap-3"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You&apos;ll need to sign in
              again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
