import { Progress } from "@/components/ui/progress";

export function VideoProgress({ progress }: { progress: number }) {
  return (
    <div className="w-full">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-muted-foreground mt-2">
        {progress}% completed
      </p>
    </div>
  );
}
