"use client";

import { useSettings } from "@/context/settings-context";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function AccessibilitySettings() {
  const {
    reduceMotion,
    setReduceMotion,
    keyboardShortcuts,
    setKeyboardShortcuts,
    enhancedScreenReader,
    setEnhancedScreenReader,
    saveSettings,
  } = useSettings();

  const handleSave = () => {
    saveSettings();
  };

  return (
    <div className="space-y-6">
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
          <Label htmlFor="keyboard-shortcuts">Enable keyboard shortcuts</Label>
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
          <Label htmlFor="screen-reader">Enhanced screen reader support</Label>
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

      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}
