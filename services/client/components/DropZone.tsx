"use client";
import React, { CSSProperties, FC, useEffect, useState } from "react";
import { DropzoneState, useDropzone } from "react-dropzone";
import Image from "next/image";
import { UploadTemplate } from "@/components/Forms/UploadForm";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const thumb: CSSProperties = {
  display: "inline-flex",
  borderRadius: 2,
  width: "auto",
  height: "100%",
  padding: 4,
  boxSizing: "border-box",
  justifyContent: "center",
  alignItems: "center",
};

interface FileWithPreview extends File {
  preview: string;
  thumbnail?: string;
}

const DropZone: FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const { getRootProps, getInputProps }: DropzoneState = useDropzone({
    accept: {
      "video/*": [],
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(
        acceptedFiles.map((file: File) => {
          const preview = URL.createObjectURL(file);
          toast.success("File uploaded successfully");
          return { ...file, preview } as FileWithPreview;
        }),
      );
    },
  });

  const generateThumbnail = (file: FileWithPreview): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = file.preview;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.play();

      video.addEventListener("loadeddata", () => {
        video.currentTime = 0.1;
      });

      video.addEventListener("seeked", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png"));
        } else {
          toast.error("Failed to get canvas context");
          reject(new Error("Failed to get canvas context"));
        }
        video.pause();
        URL.revokeObjectURL(video.src);
      });

      video.addEventListener("error", (err) => {
        reject(new Error("Failed to load video"));
      });
    });
  };

  useEffect(() => {
    files.forEach((file) => {
      if (!file.thumbnail) {
        generateThumbnail(file)
          .then((thumbnail) => {
            setFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.name === file.name ? { ...f, thumbnail } : f,
              ),
            );
          })
          .catch((error) => {
            console.error("Error generating thumbnail:", error);
          });
      }
    });

    return () =>
      files.forEach((file: FileWithPreview) =>
        URL.revokeObjectURL(file.preview),
      );
  }, [files]);

  const thumbs = files.map((file: FileWithPreview) => (
    <div style={thumb} key={file.name}>
      {file.thumbnail ? (
        <Image
          src={file.thumbnail}
          className={"rounded-lg w-full h-full object-fit"}
          alt="preview"
          width={1000}
          height={1000}
        />
      ) : (
        <Spinner />
      )}
    </div>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <div className="flex justify-center items-center">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 dark:border-gray-400 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 h-full">
              {!thumbs.length ? <UploadTemplate /> : thumbs}
            </div>
          </label>
        </div>
      </div>
    </section>
  );
};

export default DropZone;
