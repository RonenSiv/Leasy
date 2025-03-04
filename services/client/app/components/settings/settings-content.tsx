import { ProfileSettings } from "./profile-settings";
import { AccountSettings } from "./account-settings";
import { AppearanceSettings } from "./appearance-settings";
import { AccessibilitySettings } from "./accessibility-settings";

interface SettingsContentProps {
  activeSection: string;
}

export function SettingsContent({ activeSection }: SettingsContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettings />;
      case "account":
        return <AccountSettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "accessibility":
        return <AccessibilitySettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="space-y-6 w-full">
      <h1 className="text-3xl font-bold">
        {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}{" "}
        Settings
      </h1>
      <div className="border-t border-divider" />
      {renderContent()}
    </div>
  );
}
