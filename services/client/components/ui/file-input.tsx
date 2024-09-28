import React, { useRef, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface FileInputProps {
  id: string;
  accept?: string;
  disabled?: boolean;
  onChange: (file: FileList | null) => void;
  register: UseFormRegisterReturn;
}

const FileInput: React.FC<FileInputProps> = ({
  id,
  accept,
  disabled,
  onChange,
  register,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
      onChange(files);
    } else {
      setFileName(null);
      onChange(null);
    }
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
      <Input
        id={id}
        type="file"
        accept={accept}
        ref={(e) => {
          register.ref(e);
          inputRef.current = e;
        }}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          handleFileChange(e);
          register.onChange(e);
        }}
        onBlur={register.onBlur}
        name={register.name}
      />

      <button
        type="button"
        className="px-4 py-2 bg-gray-100 text-sm text-gray-700 border-r border-gray-300 hover:bg-gray-200 focus:outline-none disabled:opacity-50"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        Choose File
      </button>

      <span className="flex-1 px-4 py-2 text-sm opacity-70 overflow-hidden">
        <span
          className="block"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {fileName || "No file selected"}
        </span>
      </span>
    </div>
  );
};

export default FileInput;
