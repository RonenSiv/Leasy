import { Suspense } from "react";
import { SettingsForm } from "../components/forms/settings-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <SettingsForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
