"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { SettingsSideBar } from "@/components/settings/settings-side-bar";
import React, { useState } from "react";

export const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
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
    </>
  );
};
