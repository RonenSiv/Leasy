"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClient } from "@/hooks/use-client";

export function ProfileSettings() {
  const client = useClient();
  const [name, setName] = useState(client.user?.full_name || "");
  const [email, setEmail] = useState(client.user?.email || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile updated", { name, email });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button type="submit">Update Profile</Button>
    </form>
  );
}
