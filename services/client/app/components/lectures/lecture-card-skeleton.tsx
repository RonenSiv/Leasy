export function LectureCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border p-4">
      <div className="h-48 w-full rounded-md bg-gray-200" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  );
}
