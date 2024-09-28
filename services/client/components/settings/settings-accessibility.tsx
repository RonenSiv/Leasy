import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Label } from "@/components/ui/label"; // Assuming you have a Label component
import { toast } from "sonner"; // Import Sonner's toast

const textSizes = ["small", "medium", "large"];
const contrastModes = ["normal", "high-contrast"];
const colorblindModes = ["normal", "protanopia", "deuteranopia", "tritanopia"]; // Define colorblind modes

const AccessibilitySettings: React.FC = () => {
  const [selectedTextSize, setSelectedTextSize] = useState<string>(() => {
    return localStorage.getItem("textSize") || "medium";
  });
  const [selectedContrastMode, setSelectedContrastMode] = useState<string>(
    () => {
      return localStorage.getItem("contrastMode") || "normal";
    },
  );
  const [selectedColorblindMode, setSelectedColorblindMode] = useState<string>(
    () => {
      return localStorage.getItem("colorblindMode") || "normal";
    },
  );

  // Track initial values for comparison
  const initialTextSize = localStorage.getItem("textSize") || "medium";
  const initialContrastMode = localStorage.getItem("contrastMode") || "normal";
  const initialColorblindMode =
    localStorage.getItem("colorblindMode") || "normal";

  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

  useEffect(() => {
    // Apply text size and contrast mode to document body
    document.body.style.fontSize =
      selectedTextSize === "small"
        ? "14px"
        : selectedTextSize === "large"
          ? "18px"
          : "16px";

    document.body.setAttribute("data-contrast", selectedContrastMode);
    document.body.setAttribute("data-colorblind", selectedColorblindMode); // Apply colorblind mode
  }, [selectedTextSize, selectedContrastMode, selectedColorblindMode]);

  useEffect(() => {
    // Check if changes have been made to enable/disable the Save button
    const isTextSizeChanged = selectedTextSize !== initialTextSize;
    const isContrastModeChanged = selectedContrastMode !== initialContrastMode;
    const isColorblindModeChanged =
      selectedColorblindMode !== initialColorblindMode;

    setIsSaveDisabled(
      !(isTextSizeChanged || isContrastModeChanged || isColorblindModeChanged),
    );
  }, [
    selectedTextSize,
    selectedContrastMode,
    selectedColorblindMode,
    initialTextSize,
    initialContrastMode,
    initialColorblindMode,
  ]);

  const handleTextSizeChange = (size: string) => {
    setSelectedTextSize(size);
  };

  const handleContrastModeChange = (mode: string) => {
    setSelectedContrastMode(mode);
  };

  const handleColorblindModeChange = (mode: string) => {
    setSelectedColorblindMode(mode);
  };

  const handleSaveChanges = () => {
    // Save settings to localStorage
    localStorage.setItem("textSize", selectedTextSize);
    localStorage.setItem("contrastMode", selectedContrastMode);
    localStorage.setItem("colorblindMode", selectedColorblindMode);

    // Apply changes immediately
    document.body.style.fontSize =
      selectedTextSize === "small"
        ? "14px"
        : selectedTextSize === "large"
          ? "18px"
          : "16px";
    document.body.setAttribute("data-contrast", selectedContrastMode);
    document.body.setAttribute("data-colorblind", selectedColorblindMode);

    toast.success(
      `Accessibility settings updated: Text Size - ${selectedTextSize}, Contrast Mode - ${selectedContrastMode}, Colorblind Mode - ${selectedColorblindMode}`,
    );

    // Disable the save button after saving changes
    setIsSaveDisabled(true);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold">Accessibility Settings</h2>

      {/* Text Size Selection */}
      <p>Choose your preferred text size:</p>
      <div className="flex flex-col gap-2">
        {textSizes.map((size) => (
          <div key={size} className="flex items-center gap-2">
            <Label
              htmlFor={size}
              className="text-sm font-medium"
              style={{
                fontSize:
                  size === "small"
                    ? "14px"
                    : size === "large"
                      ? "18px"
                      : "16px",
              }}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </Label>
            <input
              type="radio"
              id={size}
              name="textSize"
              value={size}
              checked={selectedTextSize === size}
              onChange={() => handleTextSizeChange(size)}
              className="cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Contrast Mode Selection */}
      <p>Choose your preferred contrast mode:</p>
      <div className="flex flex-col gap-2">
        {contrastModes.map((mode) => (
          <div key={mode} className="flex items-center gap-2">
            <Label htmlFor={mode} className="text-sm font-medium">
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Label>
            <input
              type="radio"
              id={mode}
              name="contrastMode"
              value={mode}
              checked={selectedContrastMode === mode}
              onChange={() => handleContrastModeChange(mode)}
              className="cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Colorblind Mode Selection */}
      <p>Choose your preferred colorblind mode:</p>
      <div className="flex flex-col gap-2">
        {colorblindModes.map((mode) => (
          <div key={mode} className="flex items-center gap-2">
            <Label htmlFor={mode} className="text-sm font-medium">
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Label>
            <input
              type="radio"
              id={mode}
              name="colorblindMode"
              value={mode}
              checked={selectedColorblindMode === mode}
              onChange={() => handleColorblindModeChange(mode)}
              className="cursor-pointer"
            />
          </div>
        ))}
      </div>

      <Button
        onClick={handleSaveChanges}
        className="mt-4"
        disabled={isSaveDisabled}
      >
        Save Changes
      </Button>
    </div>
  );
};

export default AccessibilitySettings;
