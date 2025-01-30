import { Progress } from "@/components/ui/progress";

interface VideoProgressProps {
  current: number;
  total: number;
}

export function VideoProgress({ current, total }: VideoProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <Progress value={percentage} className="w-full" />
      <p className="text-sm text-muted-foreground mt-2">
        {Math.round(current)} / {total} minutes
      </p>
    </div>
  );
}
