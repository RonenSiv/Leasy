import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const LearningMaterialsCardSkeleton: React.FC = () => (
  <div className="w-full h-full flex-1 bg-gray-900 p-4 rounded-lg">
    <Tabs defaultValue="transcript">
      <TabsList className="flex bg-gray-800 p-2 rounded-lg">
        <TabsTrigger
          value="transcript"
          className="flex-1 text-center py-2 bg-purple-600 text-white rounded-lg"
        >
          <Skeleton className="w-full h-6" />
        </TabsTrigger>
        <TabsTrigger
          value="summary"
          className="flex-1 text-center py-2 text-gray-300"
        >
          <Skeleton className="w-full h-6" />
        </TabsTrigger>
        <TabsTrigger
          value="quiz"
          className="flex-1 text-center py-2 text-gray-300"
        >
          <Skeleton className="w-full h-6" />
        </TabsTrigger>
        <TabsTrigger
          value="notes"
          className="flex-1 text-center py-2 text-gray-300"
        >
          <Skeleton className="w-full h-6" />
        </TabsTrigger>
      </TabsList>

      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <TabsContent value="transcript">
          {/* Skeleton content */}
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-full h-6" />
        </TabsContent>
        <TabsContent value="summary">
          {/* Skeleton content */}
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-full h-6" />
        </TabsContent>
        <TabsContent value="quiz">
          {/* Skeleton content */}
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-full h-6" />
        </TabsContent>
        <TabsContent value="notes">
          {/* Skeleton content */}
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-full h-6 mb-2" />
          <Skeleton className="w-full h-6" />
        </TabsContent>
      </div>
    </Tabs>
  </div>
);

export default LearningMaterialsCardSkeleton;
