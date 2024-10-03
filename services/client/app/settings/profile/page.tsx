"use client";

import { SettingsSideBar } from "@/components/settings/settings-side-bar";
import React, { useState } from "react";
import { SettingsContent } from "@/components/settings/settings-content";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-screen">
      <Button
        variant="ghost"
        className="md:hidden m-4 w-10 h-10 p-2"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu />
      </Button>
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block md:w-1/4 md:min-w-[200px] h-full`}
      >
        <SettingsSideBar />
      </div>
      <div className="flex-1 w-full h-full">
        <SettingsContent />
      </div>
    </div>
  );
}
