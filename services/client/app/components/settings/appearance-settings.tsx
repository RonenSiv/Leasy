"use client";

import { useSettings } from "@/context/settings-context";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

export function AppearanceSettings() {
  const { fontSize, setFontSize, colorScheme, setColorScheme, saveSettings } =
    useSettings();

  const handleSave = () => {
    saveSettings();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Font Size</h2>
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
        <h2 className="text-xl font-semibold mb-4">Color Scheme</h2>
        <div className="grid grid-cols-3 gap-4">
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

      <Button onClick={handleSave}>Save Changes</Button>
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
