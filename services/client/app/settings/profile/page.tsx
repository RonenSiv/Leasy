import { SettingsContent } from "@/components/settings/settings-content";
import { Sidebar } from "@/app/settings/profile/sidebar";

export default async function ProfileSettingsPage() {
  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-screen">
      <Sidebar />
      <div className="flex-1 w-full h-full">
        <SettingsContent />
      </div>
    </div>
  );
}
