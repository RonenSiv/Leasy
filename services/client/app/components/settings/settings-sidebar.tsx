import { cn } from "@/lib/utils";

const settingsSections = [
  { id: "profile", label: "Profile" },
  { id: "account", label: "Account" },
  { id: "appearance", label: "Appearance" },
  { id: "accessibility", label: "Accessibility" },
];

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function SettingsSidebar({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  return (
    <nav className="space-y-1">
      {settingsSections.map((section) => (
        <button
          key={section.id}
          className={cn(
            "block w-full text-left px-3 py-2 rounded-md text-sm font-medium",
            activeSection === section.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted",
          )}
          onClick={() => onSectionChange(section.id)}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}
