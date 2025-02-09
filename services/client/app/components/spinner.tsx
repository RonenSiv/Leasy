import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({
  className,
  full = true,
}: {
  className?: string;
  full?: boolean;
}) {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: full ? "100%" : "auto" }}
    >
      <Loader2 className={cn("h-8 w-8 animate-spin text-primary", className)} />
    </div>
  );
}
