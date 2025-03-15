import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <Image
          src="/main.png"
          width={300}
          height={300}
          alt="Cute sloth with laptop and coffee"
          className="mx-auto"
          priority
        />
        <h1 className="text-4xl font-bold mt-8">Oops!</h1>
        <p className="text-primary text-lg">
          Looks like this page is taking a coffee break
        </p>
        <p className="text-gray-400">
          The page you&apos;re looking for can&apos;t be found. Time to head
          back home?
        </p>
        <Button asChild className="bg-primary/90 hover:bg-primary/70">
          <Link href="/" className="inline-flex items-center gap-2">
            <HomeIcon size={18} />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
