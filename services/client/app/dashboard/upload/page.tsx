import { Card } from "@/app/components/Card";
import Image from "next/image";
import UploadForm from "@/app/components/UploadForm";
import { LinkSubmission } from "@/app/components/LinkSubmission";

export default async function Upload() {
  return (
    <Card
      title="Upload Video"
      titleColor="#2CA15D"
      className="justify-content-center text-center"
      maxWidth="5xl"
    >
      <Card className="bg-[#EFFFF6] w-screen" maxWidth="4xl">
        <div className="flex flex-col justify-items-center py-10">
          <div className="flex justify-center items-center">
            <div>
              <Image
                src={"/upload.svg"}
                alt={"upload image"}
                width="75"
                height="75"
              />
            </div>
            <div className="text-gray-400">
              Drag a video here or
              <span className="ml-1">
                <UploadForm />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center py-16">
            <hr className="w-full border-t-1 border-gray-300" />
            <span className="px-4 font-bold bg-transparent text-gray-500">
              OR
            </span>
            <hr className="w-full border-t-1 border-gray-300" />
          </div>
          <LinkSubmission />
        </div>
      </Card>
    </Card>
  );
}
