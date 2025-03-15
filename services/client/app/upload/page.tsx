import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoUpload } from "../components/forms/upload-form";

export default function UploadPage() {
  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Upload a New Lecture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VideoUpload />
        </CardContent>
      </Card>
    </div>
  );
}
