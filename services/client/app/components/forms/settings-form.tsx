"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettings } from "@/context/settings-context";
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
import { SettingsConfirmationModal } from "../settings/settings-confirmation-modal";
import { useClient } from "@/hooks/use-client";

export function SettingsForm() {
  const [activeTab, setActiveTab] = useState("appearance");
  const router = useRouter();
  const client = useClient();
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

  const handleLogout = async () => {
    await client.logout();
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
    originalSaveSettings();
    setShowConfirmationModal(false);
    setHasUnsavedChanges(false);
    setInitialSettings({
      fontSize,
      reduceMotion,
      keyboardShortcuts,
      enhancedScreenReader,
      colorScheme,
    });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">User Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        {hasUnsavedChanges && (
          <Button onClick={saveSettings}>Save changes</Button>
        )}
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-2">Appearance</h3>
          <div className="space-y-4">
            <div>
              <Label>Font Size</Label>
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
            <div>
              <Label>Color Scheme</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {colorSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
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

        <div>
          <h3 className="text-lg font-medium mb-2">Accessibility</h3>
          <div className="space-y-4">
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

      <div className="pt-6 border-t">
        <Button variant="destructive" onClick={() => setShowLogoutDialog(true)}>
          Log Out
        </Button>
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

const colorSchemes = [
  { id: "default", name: "Default Blue", color: "#3498db" },
  { id: "forest", name: "Forest Green", color: "#2ecc71" },
  { id: "ruby", name: "Ruby Red", color: "#e74c3c" },
  { id: "royal", name: "Royal Purple", color: "#9b59b6" },
  { id: "sunset", name: "Sunset Orange", color: "#f39c12" },
  { id: "ocean", name: "Ocean Teal", color: "#16a085" },
];
