"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const initialCookieSettings = {
  necessary: true,
  performance: false,
  functional: false,
};

export function ManageCookies() {
  const [cookieSettings, setCookieSettings] = useState(initialCookieSettings);
  const [initialSettings] = useState(initialCookieSettings);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    const settingsChanged =
      cookieSettings.necessary !== initialSettings.necessary ||
      cookieSettings.performance !== initialSettings.performance ||
      cookieSettings.functional !== initialSettings.functional;

    setIsSaveDisabled(!settingsChanged);
  }, [cookieSettings, initialSettings]);

  const handleToggleChange = (cookieType: keyof typeof cookieSettings) => {
    setCookieSettings((prev) => ({
      ...prev,
      [cookieType]: !prev[cookieType],
    }));
  };

  const handleSaveSettings = () => {
    toast.success("Cookie preferences saved successfully!");
  };

  return (
    <div className="mx-auto max-w-6xl flex flex-col gap-6 p-6">
      <h2 className="text-2xl font-semibold">Manage Cookies</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Necessary Cookies */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Necessary Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Necessary cookies enable core functionality such as security,
              network management, and accessibility. These cookies cannot be
              disabled.
            </p>
            <div className="mt-4">
              <Switch
                checked={cookieSettings.necessary}
                onCheckedChange={() => handleToggleChange("necessary")}
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Performance Cookies */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Performance Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Performance cookies help us understand how visitors interact with
              the website by collecting information anonymously, which allows us
              to improve the user experience.
            </p>
            <div className="mt-4">
              <Switch
                checked={cookieSettings.performance}
                onCheckedChange={() => handleToggleChange("performance")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Functional Cookies */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Functional Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Functional cookies enable the website to provide enhanced
              functionality and personalization. If you disable these cookies,
              some features may not work correctly.
            </p>
            <div className="mt-4">
              <Switch
                checked={cookieSettings.functional}
                onCheckedChange={() => handleToggleChange("functional")}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleSaveSettings}
        className="mt-4"
        disabled={isSaveDisabled}
      >
        Save Preferences
      </Button>
    </div>
  );
}
