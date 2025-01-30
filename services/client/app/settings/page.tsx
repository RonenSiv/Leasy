"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettings } from "@/context/settings-context";
import { Globe, Palette } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SettingsConfirmationModal } from "../components/settings/settings-confirmation-modal";
import toast from "react-hot-toast";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("appearance");
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    fontSize,
    setFontSize: setFontSizeState,
    reduceMotion,
    setReduceMotion: setReduceMotionState,
    keyboardShortcuts,
    setKeyboardShortcuts: setKeyboardShortcutsState,
    enhancedScreenReader,
    setEnhancedScreenReader: setEnhancedScreenReaderState,
    colorScheme,
    setColorScheme: setColorSchemeState,
    saveSettings: originalSaveSettings,
    hasUnsavedChanges,
    setHasUnsavedChanges,
  } = useSettings();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<{ [key: string]: any }>(
    {},
  );
  const [initialSettings, setInitialSettings] = useState({
    fontSize,
    reduceMotion,
    keyboardShortcuts,
    enhancedScreenReader,
    colorScheme,
  });

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const saveSettings = () => {
    const changes: { [key: string]: { old: any; new: any } } = {};
    if (fontSize !== initialSettings.fontSize) {
      changes.fontSize = { old: initialSettings.fontSize, new: fontSize };
    }
    if (reduceMotion !== initialSettings.reduceMotion) {
      changes.reduceMotion = {
        old: initialSettings.reduceMotion,
        new: reduceMotion,
      };
    }
    if (keyboardShortcuts !== initialSettings.keyboardShortcuts) {
      changes.keyboardShortcuts = {
        old: initialSettings.keyboardShortcuts,
        new: keyboardShortcuts,
      };
    }
    if (enhancedScreenReader !== initialSettings.enhancedScreenReader) {
      changes.enhancedScreenReader = {
        old: initialSettings.enhancedScreenReader,
        new: enhancedScreenReader,
      };
    }
    if (colorScheme !== initialSettings.colorScheme) {
      changes.colorScheme = {
        old: initialSettings.colorScheme,
        new: colorScheme,
      };
    }

    if (Object.keys(changes).length > 0) {
      setShowConfirmationModal(true);
      setPendingChanges(changes);
    }
  };

  const confirmSaveSettings = () => {
    // Implement the actual saving logic here
    setShowConfirmationModal(false);
    setHasUnsavedChanges(false);
    setInitialSettings({
      fontSize,
      reduceMotion,
      keyboardShortcuts,
      enhancedScreenReader,
      colorScheme,
    });
    toast.success("Settings saved successfully");
  };

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

  return (
    <div className="container mx-auto py-10">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors
                  ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-2xl">
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold mb-1">
                    Appearance settings
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Customize how Leasy looks on your device
                  </p>
                </div>
                {hasUnsavedChanges && (
                  <Button onClick={saveSettings}>Save changes</Button>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Font size</h2>
                  <RadioGroup
                    value={fontSize}
                    onValueChange={(value: any) => setFontSize(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small" id="small" />
                      <Label htmlFor="small">Small</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="large" id="large" />
                      <Label htmlFor="large">Large</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Color scheme</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {colorSchemes.map((scheme) => (
                      <div
                        key={scheme.name}
                        className={`border rounded-lg p-4 cursor-pointer hover:border-primary ${
                          colorScheme === scheme.id ? "border-primary" : ""
                        }`}
                        onClick={() => setColorScheme(scheme.id)}
                      >
                        <div
                          className="w-full h-20 rounded-md mb-2"
                          style={{ backgroundColor: scheme.color }}
                        />
                        <p className="text-sm font-medium">{scheme.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "accessibility" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold mb-1">
                    Accessibility settings
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Customize your experience to make Leasy more accessible
                  </p>
                </div>
                {hasUnsavedChanges && (
                  <Button onClick={saveSettings}>Save changes</Button>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Motion</h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reduce-motion">Reduce motion</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce or remove animations and transitions
                      </p>
                    </div>
                    <Switch
                      id="reduce-motion"
                      checked={reduceMotion}
                      onCheckedChange={setReduceMotion}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Keyboard navigation</h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="keyboard-shortcuts">
                        Enable keyboard shortcuts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Navigate Leasy using keyboard shortcuts
                      </p>
                    </div>
                    <Switch
                      id="keyboard-shortcuts"
                      checked={keyboardShortcuts}
                      onCheckedChange={setKeyboardShortcuts}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Screen reader</h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="screen-reader">
                        Enhanced screen reader support
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enable additional descriptions for screen readers
                      </p>
                    </div>
                    <Switch
                      id="screen-reader"
                      checked={enhancedScreenReader}
                      onCheckedChange={setEnhancedScreenReader}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add other tabs here */}

          <div className="mt-8">
            <Button
              variant="destructive"
              onClick={() => setShowLogoutDialog(true)}
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to log out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to the home page and will need to log in
              again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <SettingsConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={confirmSaveSettings}
        changes={pendingChanges}
      />
    </div>
  );
}

const settingsTabs = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "accessibility", label: "Accessibility", icon: Globe },
];

const colorSchemes = [
  { id: "default", name: "Default Blue", color: "#3498db" },
  { id: "forest", name: "Forest Green", color: "#2ecc71" },
  { id: "ruby", name: "Ruby Red", color: "#e74c3c" },
  { id: "royal", name: "Royal Purple", color: "#9b59b6" },
  { id: "sunset", name: "Sunset Orange", color: "#f39c12" },
  { id: "ocean", name: "Ocean Teal", color: "#16a085" },
];
