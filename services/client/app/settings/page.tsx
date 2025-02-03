"use client";

import { Suspense, useState } from "react";
import { SettingsSidebar } from "../components/settings/settings-sidebar";
import { SettingsContent } from "../components/settings/settings-content";
import { Spinner } from "@/app/components/spinner";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="container mx-auto py-10 flex justify-around">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <SettingsSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </aside>
        <main className={"md:w-[50vw] flex-1"}>
          <Suspense fallback={<Spinner />}>
            <SettingsContent activeSection={activeSection} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
