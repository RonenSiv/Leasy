import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { securityPolicyContent } from "@/constants/content";
import ReactMarkdown from "react-markdown";

// Tab titles
const tabs = ["Change Password", "Security Policy"];

const SecuritySettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

  // Check if password inputs are valid and update save button state
  useEffect(() => {
    const passwordsValid =
      currentPassword.trim() !== "" &&
      newPassword.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      newPassword === confirmPassword;

    setIsSaveDisabled(!passwordsValid);
  }, [currentPassword, newPassword, confirmPassword]);

  const handlePasswordChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) => {
    setter(value);
  };

  const handleSaveChanges = () => {
    if (currentPassword && newPassword === confirmPassword) {
      // Simulate a password change operation
      console.log("Password changed successfully!");

      toast.success("Password changed successfully!");

      // Reset form state
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsSaveDisabled(true);
    } else {
      toast.error("Password mismatch. Please try again.");
    }
  };

  const renderContent = () => {
    if (activeTab === "Change Password") {
      return (
        <div className="flex flex-col gap-4 p-4">
          <h2 className="text-xl font-semibold">Change Your Password</h2>

          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="current-password" className="text-sm font-medium">
                Current Password
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  handlePasswordChange(setCurrentPassword, e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-password" className="text-sm font-medium">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) =>
                  handlePasswordChange(setNewPassword, e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  handlePasswordChange(setConfirmPassword, e.target.value)
                }
                className="mt-1"
              />
            </div>
          </div>

          <Button
            onClick={handleSaveChanges}
            className="mt-4"
            disabled={isSaveDisabled}
          >
            Save Changes
          </Button>
        </div>
      );
    }

    if (activeTab === "Security Policy") {
      return (
        <div className="flex flex-col gap-4 p-4">
          <h2 className="text-xl font-semibold">Site Security Policy</h2>
          <ReactMarkdown>{securityPolicyContent}</ReactMarkdown>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 border-b-2 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-lg ${
              activeTab === tab
                ? "border-b-4 border-primary text-primary"
                : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

export default SecuritySettings;
