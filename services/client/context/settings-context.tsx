"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

interface SettingsContextType {
  fontSize: "small" | "medium" | "large";
  setFontSize: (size: "small" | "medium" | "large") => void;
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
  keyboardShortcuts: boolean;
  setKeyboardShortcuts: (enable: boolean) => void;
  enhancedScreenReader: boolean;
  setEnhancedScreenReader: (enable: boolean) => void;
  colorScheme: string;
  setColorScheme: (scheme: string) => void;
  saveSettings: () => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const [fontSize, setFontSizeState] = useState<"small" | "medium" | "large">(
    "medium",
  );
  const [reduceMotion, setReduceMotionState] = useState(false);
  const [keyboardShortcuts, setKeyboardShortcutsState] = useState(true);
  const [enhancedScreenReader, setEnhancedScreenReaderState] = useState(true);
  const [colorScheme, setColorSchemeState] = useState("default");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track changes
  const setFontSize = (size: "small" | "medium" | "large") => {
    setFontSizeState(size);
    setHasUnsavedChanges(true);
  };

  const setReduceMotion = (reduce: boolean) => {
    setReduceMotionState(reduce);
    setHasUnsavedChanges(true);
  };

  const setKeyboardShortcuts = (enable: boolean) => {
    setKeyboardShortcutsState(enable);
    setHasUnsavedChanges(true);
  };

  const setEnhancedScreenReader = (enable: boolean) => {
    setEnhancedScreenReaderState(enable);
    setHasUnsavedChanges(true);
  };

  const setColorScheme = (scheme: string) => {
    setColorSchemeState(scheme);
    setHasUnsavedChanges(true);
  };

  // Load settings from localStorage
  useEffect(() => {
    const storedSettings = localStorage.getItem("userSettings");
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      setFontSizeState(settings.fontSize);
      setReduceMotionState(settings.reduceMotion);
      setKeyboardShortcutsState(settings.keyboardShortcuts);
      setEnhancedScreenReaderState(settings.enhancedScreenReader);
      setColorSchemeState(settings.colorScheme);
    }
  }, []);

  // Save settings
  const saveSettings = () => {
    const settings = {
      fontSize,
      reduceMotion,
      keyboardShortcuts,
      enhancedScreenReader,
      colorScheme,
    };
    localStorage.setItem("userSettings", JSON.stringify(settings));
    setHasUnsavedChanges(false);
    toast.success("Settings saved successfully");
  };

  // Apply settings
  useEffect(() => {
    document.documentElement.style.fontSize = {
      small: "14px",
      medium: "16px",
      large: "18px",
    }[fontSize];

    if (reduceMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }

    if (keyboardShortcuts) {
      document.addEventListener("keydown", handleKeyboardShortcuts);
    } else {
      document.removeEventListener("keydown", handleKeyboardShortcuts);
    }

    if (enhancedScreenReader) {
      document.documentElement.setAttribute("aria-live", "polite");
    } else {
      document.documentElement.removeAttribute("aria-live");
    }

    const scheme = {
      default: {
        "--primary": "221.2 83.2% 53.3%",
        "--primary-foreground": "210 40% 98%",
      },
      forest: {
        "--primary": "142.1 76.2% 36.3%",
        "--primary-foreground": "355.7 100% 97.3%",
      },
      ruby: {
        "--primary": "346.8 77.2% 49.8%",
        "--primary-foreground": "355.7 100% 97.3%",
      },
      royal: {
        "--primary": "262.1 83.3% 57.8%",
        "--primary-foreground": "210 40% 98%",
      },
      sunset: {
        "--primary": "24.6 95% 53.1%",
        "--primary-foreground": "60 9.1% 97.8%",
      },
      ocean: {
        "--primary": "183 74% 44%",
        "--primary-foreground": "210 40% 98%",
      },
    }[colorScheme];

    if (scheme) {
      Object.entries(scheme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }

    return () => {
      document.removeEventListener("keydown", handleKeyboardShortcuts);
    };
  }, [
    fontSize,
    reduceMotion,
    keyboardShortcuts,
    enhancedScreenReader,
    colorScheme,
  ]);

  const handleKeyboardShortcuts = (e: KeyboardEvent) => {
    if (!keyboardShortcuts) return;

    // Implement global keyboard shortcuts here
    if (e.ctrlKey && e.key === "h") {
      e.preventDefault();
      window.location.href = "/";
    } else if (e.ctrlKey && e.key === "b") {
      e.preventDefault();
      window.location.href = "/browse";
    } else if (e.ctrlKey && e.key === "u") {
      e.preventDefault();
      window.location.href = "/upload";
    }
    // Add more shortcuts as needed
  };

  return (
    <SettingsContext.Provider
      value={{
        fontSize,
        setFontSize,
        reduceMotion,
        setReduceMotion,
        keyboardShortcuts,
        setKeyboardShortcuts,
        enhancedScreenReader,
        setEnhancedScreenReader,
        colorScheme,
        setColorScheme,
        saveSettings,
        hasUnsavedChanges,
        setHasUnsavedChanges,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
