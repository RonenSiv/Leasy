import { Suspense } from "react";
import { UploadForm } from "../components/forms/upload-form";
import { UploadSkeleton } from "./skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadPage() {
  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Upload a Video</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<UploadSkeleton />}>
            <UploadForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
