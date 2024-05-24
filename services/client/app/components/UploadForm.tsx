"use client";

export default function UploadForm() {
  return (
    <form className="inline-flex flex-col gap-4">
      <label>
        <div className="text-[#2CA15D] hover:cursor-pointer underline">
          Upload a file
        </div>
        <input className="hidden" type="file" name="file" />
      </label>
    </form>
  );
}
