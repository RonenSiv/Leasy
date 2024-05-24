import React, { ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faInfoCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from "react-tooltip";

export type FormFieldStatus = "none" | "warning" | "error" | "info";

interface FormFieldProps {
  label?: string;
  type?: "email" | "password" | "text" | "url" | "search";
  name?: string;
  status?: FormFieldStatus;
  statusMessage?: string;
  informativeLabel?: boolean;
  informativeLabelMessage?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
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
  onChange,
  className,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "warning":
        return (
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-yellow-500"
          />
        );
      case "error":
        return (
          <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
        );
      case "info":
        return (
          <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />
        );
      default:
        return null;
    }
  };

  const statusInputClasses = {
    warning: "border-yellow-500",
    error: "border-red-500",
    info: "border-blue-500",
    none: "border-gray-300",
  };

  const statusMessageClasses = {
    warning: "text-yellow-500",
    error: "text-red-500",
    info: "text-blue-500",
    none: "text-gray-300",
  };

  const infoLabelId = generateRandomId();

  return (
    <div className="mb-5">
      <label
        htmlFor={label}
        className={`block mb-2 text-sm font-medium text-gray-900`}
      >
        {label} {required && <span className="text-red-500">*</span>}{" "}
        {informativeLabel && (
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-blue-500"
            data-tooltip-id={infoLabelId}
          />
        )}
      </label>
      <div className="relative">
        <input
          type={type}
          id={label}
          className={`relative bg-gray-50 border ${statusInputClasses[status]} text-gray-900 text-sm rounded-lg block w-full p-2.5 ${className}`}
          placeholder={placeholder}
          required={required}
          onChange={onChange}
          name={name}
        />
        {status !== "none" && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-50">
            {getStatusIcon()}
          </div>
        )}
      </div>
      {status !== "none" && statusMessage && (
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
