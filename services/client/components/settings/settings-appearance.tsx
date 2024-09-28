import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const themes = ["light", "dark", "system"];
const fontSizes = ["small", "medium", "large"];
const fonts = ["Roboto", "Arial", "Georgia", "Times New Roman", "Verdana"];

const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>(theme || "system");
  const [selectedFontSize, setSelectedFontSize] = useState<string>(() => {
    return localStorage.getItem("fontSize") || "medium";
  });
  const [selectedFont, setSelectedFont] = useState<string>(() => {
    return localStorage.getItem("font") || "Roboto";
  });

  const initialTheme = theme || "system";
  const initialFontSize = localStorage.getItem("fontSize") || "medium";
  const initialFont = localStorage.getItem("font") || "Roboto";

  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

  useEffect(() => {
    setSelectedTheme(theme || "system");
  }, [theme]);

  useEffect(() => {
    const isThemeChanged = selectedTheme !== initialTheme;
    const isFontSizeChanged = selectedFontSize !== initialFontSize;
    const isFontChanged = selectedFont !== initialFont;

    setIsSaveDisabled(!(isThemeChanged || isFontSizeChanged || isFontChanged));
  }, [
    selectedTheme,
    selectedFontSize,
    selectedFont,
    initialTheme,
    initialFontSize,
    initialFont,
  ]);

  const handleThemeChange = (themeOption: string) => {
    setSelectedTheme(themeOption);
  };

  const handleFontSizeChange = (size: string) => {
    setSelectedFontSize(size);
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
  };

  const handleSaveChanges = () => {
    setTheme(selectedTheme);
    localStorage.setItem("fontSize", selectedFontSize);
    localStorage.setItem("font", selectedFont);

    document.body.style.fontSize =
      selectedFontSize === "small"
        ? "14px"
        : selectedFontSize === "large"
          ? "18px"
          : "16px";
    document.body.style.fontFamily = selectedFont;

    toast.success(
      `Appearance settings updated: Theme - ${selectedTheme}, Font Size - ${selectedFontSize}, Font - ${selectedFont}`,
    );

    setIsSaveDisabled(true);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold">Appearance Settings</h2>

      {/* Theme Selection */}
      <p>Choose your preferred theme for the site:</p>
      <div className="flex flex-col gap-2">
        {themes.map((themeOption) => (
          <div key={themeOption} className="flex items-center gap-2">
            <Label htmlFor={themeOption} className="text-sm font-medium">
              {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
            </Label>
            <input
              type="radio"
              id={themeOption}
              name="theme"
              value={themeOption}
              checked={selectedTheme === themeOption}
              onChange={() => handleThemeChange(themeOption)}
              className="cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Font Size Selection */}
      <p>Choose your preferred font size:</p>
      <div className="flex flex-col gap-2">
        {fontSizes.map((size) => (
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
              name="fontSize"
              value={size}
              checked={selectedFontSize === size}
              onChange={() => handleFontSizeChange(size)}
              className="cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Font Selection */}
      <p>Choose your preferred font:</p>
      <div className="flex flex-col gap-2">
        {fonts.map((font) => (
          <div key={font} className="flex items-center gap-2">
            <Label
              htmlFor={font}
              className="text-sm font-medium"
              style={{
                fontFamily: font,
              }}
            >
              {font}
            </Label>
            <input
              type="radio"
              id={font}
              name="font"
              value={font}
              checked={selectedFont === font}
              onChange={() => handleFontChange(font)}
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

export default AppearanceSettings;
