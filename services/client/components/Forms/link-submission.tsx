"use client";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  linkSubmissionSchema,
  LinkSubmissionSchema,
} from "@/lib/schemas/useFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { submitLink } from "@/app/actions/actions";
import { FormField } from "@/components/Forms/form-field";
import { toast } from "sonner";

export const LinkSubmission = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LinkSubmissionSchema>({
    resolver: zodResolver(linkSubmissionSchema),
    defaultValues: {
      url: "",
    },
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(submitLink, {
    success: false,
  });
  useEffect(() => {
    if (state.success) {
      toast.success("File uploaded successfully", {
        closeButton: true,
      });
    } else if (!state.issues) {
      toast.error("Failed to upload the file", {
        closeButton: true,
      });
    }
  }, [state.success]);
  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log(videoUrl);
  //   try {
  //     const response = await fetch("/api/upload-video", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ videoUrl }),
  //     });
  //
  //     if (!response.ok) {
  //       throw new Error("Failed to upload the video");
  //     }
  //
  //     const data = await response.json();
  //     setMessage(data?.message || data?.error || "Unknown error occurred");
  //   } catch (error: any) {
  //     setMessage(
  //       error?.message || "An error occurred while uploading the video",
  //     );
  //   }
  // };

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(() => {
          formAction(new FormData(formRef.current!));
        })(e);
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 items-center justify-center">
          <FormField
            label="Video URL"
            type="text"
            placeholder="Enter video URL"
            status={errors.url ? "error" : "none"}
            statusMessage={errors.url?.message}
            name="url"
            register={register("url")}
            required
            noMargin
          />
          <div
            className={`flex ${errors.url?.message ? "justify-center" : "self-end"} justify-self-end`}
          >
            <button
              type="submit"
              className="bg-white bg-action border border-green-300 dark:border-green-700 text-white dark:text-gray-900 px-6 py-2 rounded-3xl hover:bg-green-800 dark:hover:bg-green-500 hover:cursor-pointer"
            >
              Upload
            </button>
          </div>
        </div>
        {!state.success && state.issues && (
          <div className="text-red-500 dark:text-red-400">{state.issues}</div>
        )}
      </div>
    </form>
  );
};
