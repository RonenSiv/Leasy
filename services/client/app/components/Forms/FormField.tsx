import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {
  IoIosCloseCircleOutline,
  IoIosInformationCircleOutline,
  IoIosWarning,
} from "react-icons/io";
import { UseFormRegisterReturn } from "react-hook-form";

export type FormFieldStatus = "none" | "warning" | "error" | "info";

interface FormFieldProps {
  label?: string;
  type?: "email" | "password" | "text" | "url" | "search";
  name: string;
  status?: FormFieldStatus;
  statusMessage?: string;
  informativeLabel?: boolean;
  informativeLabelMessage?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  register: UseFormRegisterReturn;
  noMargin?: boolean;
}

const generateRandomId = () => {
  return "tooltip-" + Math.random().toString(36).substr(2, 9);
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  name,
  status = "none",
  statusMessage,
  informativeLabel,
  informativeLabelMessage,
  required = false,
  placeholder,
  className,
  register,
  noMargin = false,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "warning":
        return (
          <IoIosWarning className="text-yellow-500 dark:text-yellow-400" />
        );
      case "error":
        return (
          <IoIosCloseCircleOutline className="text-red-500 dark:text-red-400" />
        );
      case "info":
        return (
          <IoIosInformationCircleOutline className="text-blue-500 dark:text-blue-400" />
        );
      default:
        return null;
    }
  };

  const statusInputClasses = {
    warning: "border-yellow-500 dark:border-yellow-400",
    error: "border-red-500 dark:border-red-400",
    info: "border-blue-500 dark:border-blue-400",
    none: "border-gray-300 dark:border-gray-600",
  };

  const statusMessageClasses = {
    warning: "text-yellow-500 dark:text-yellow-400",
    error: "text-red-500 dark:text-red-400",
    info: "text-blue-500 dark:text-blue-400",
    none: "text-gray-300 dark:text-gray-500",
  };

  const infoLabelId = generateRandomId();

  return (
    <div className={`${noMargin ? "" : "mb-5"} flex-1`}>
      <label
        htmlFor={name}
        className={`flex mb-2 text-sm font-medium text-gray-900 dark:text-gray-100 items-center`}
      >
        {label}
        {required && (
          <span className="text-blue-400 dark:text-red-400 ml-1"> *</span>
        )}
        {informativeLabel && (
          <IoIosInformationCircleOutline
            className="text-blue-500 dark:text-blue-400 inline-flex ml-1 cursor-pointer justify-center items-center focus:outline-none hover:text-blue-700 dark:hover:text-blue-300"
            data-tooltip-id={infoLabelId}
          />
        )}
      </label>
      <div className="relative">
        <input
          type={type}
          id={name}
          className={`relative bg-gray-50 dark:bg-gray-800 border ${statusInputClasses[status]} text-gray-900 dark:text-gray-100 text-sm rounded-lg block w-full p-2.5 outline-none ${className}`}
          placeholder={placeholder}
          {...register}
        />
        {status !== "none" && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-50">
            {getStatusIcon()}
          </div>
        )}
      </div>
      {statusMessage && (
        <p className={`mt-2 text-sm ${statusMessageClasses[status]}`}>
          {statusMessage}
        </p>
      )}
      <ReactTooltip
        id={infoLabelId}
        place="right"
        content={informativeLabelMessage}
        variant={"info"}
      />
    </div>
  );
};
