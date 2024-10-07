import { Skeleton } from "@/components/ui/skeleton";

const StudyPageSkeleton = () => {
  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Video Player Skeleton */}
      <div className="bg-gray-200 w-full h-64 rounded-md">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Learning Materials Skeleton */}
      <div className="flex flex-col space-y-4">
        <div className="bg-gray-200 w-32 h-6 rounded-md">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="flex space-x-4">
          <div className="bg-gray-200 w-full h-32 rounded-md">
            <Skeleton className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* AI Study Buddy Skeleton */}
      <div className="flex flex-col space-y-4">
        <div className="bg-gray-200 w-full h-10 rounded-md">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="flex flex-col space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 w-full h-12 rounded-md">
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyPageSkeleton;
