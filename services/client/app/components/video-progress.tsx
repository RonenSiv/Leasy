import { Progress } from "@/components/ui/progress";

interface VideoProgressProps {
  current: number;
  total: number;
}

function formatTime(seconds: number): string {
  const sec = Math.floor(seconds);
  if (sec < 60) {
    return `${sec} sec`;
  } else if (sec < 3600) {
    const minutes = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${minutes}:${remainder < 10 ? "0" : ""}${remainder} min`;
  } else {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const remainder = sec % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${remainder < 10 ? "0" : ""}${remainder} hr`;
  }
}

export function VideoProgress({ current, total }: VideoProgressProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      <Progress value={percentage} className="w-full" />
      <p className="text-sm text-muted-foreground mt-2">
        {formatTime(current)} / {formatTime(total)}
      </p>
    </div>
  );
}
