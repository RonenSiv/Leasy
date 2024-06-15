"use client";

import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
} from "react";
import {
  MdOutlineCookie,
  MdOutlinePolicy,
  MdOutlineSpaceDashboard,
  MdOutlineSubscriptions,
} from "react-icons/md";
import { LiaUser } from "react-icons/lia";
import { HiOutlineBell, HiOutlinePaintBrush } from "react-icons/hi2";
import {
  IoAccessibilityOutline,
  IoLanguageOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { FaRegComments, FaRegStickyNote } from "react-icons/fa";
import { GrIntegration, GrOverview } from "react-icons/gr";
import { GiArtificialIntelligence } from "react-icons/gi";
import { RiCustomerService2Line } from "react-icons/ri";
import { DataTable } from "@/components/settings/dashboard-table";
import { SettingsAccount } from "@/components/settings/settings-account";

type SettingsOptionType = {
  title: string;
  icon: ReactNode;
};

const settingsOptions: SettingsOptionType[] = [
  { title: "Dashboard", icon: <MdOutlineSpaceDashboard /> },
  { title: "Account", icon: <LiaUser /> },
  { title: "Appearance", icon: <HiOutlinePaintBrush /> },
  { title: "Accessibility", icon: <IoAccessibilityOutline /> },
  { title: "Security", icon: <IoShieldCheckmarkOutline /> },
  { title: "Subscription Management", icon: <MdOutlineSubscriptions /> },
  { title: "Notification Settings", icon: <HiOutlineBell /> },
  { title: "Language Preferences", icon: <IoLanguageOutline /> },
  { title: "Studying Notes", icon: <FaRegStickyNote /> },
  { title: "Study Overview", icon: <GrOverview /> },
  { title: "AI Settings", icon: <GiArtificialIntelligence /> },
  { title: "Policy", icon: <MdOutlinePolicy /> },
  { title: "Manage Cookies", icon: <MdOutlineCookie /> },
  { title: "Help & Support", icon: <RiCustomerService2Line /> },
  { title: "Feedback", icon: <FaRegComments /> },
  { title: "Integration Settings", icon: <GrIntegration /> },
];

const settingsContent: ReactNode[] = [
  <DataTable key={1} />,
  <SettingsAccount key={2} />,
];

enum SettingsOption {
  DASHBOARD,
  ACCOUNT,
  APPEARANCE,
  ACCESSIBILITY,
  SECURITY,
  SUBSCRIPTION_MANAGEMENT,
  NOTIFICATION_SETTINGS,
  LANGUAGE_PREFERENCES,
  STUDYING_NOTES,
  STUDY_OVERVIEW,
  AI_SETTINGS,
  POLICY,
  MANAGE_COOKIES,
  HELP_AND_SUPPORT,
  FEEDBACK,
  INTEGRATION_SETTINGS,
}

interface SettingsContextType {
  selectedOption: SettingsOption;
  handleSelectOption: (option: string) => void;
  currentSelectedSettingOption: () => SettingsOptionType;
  profileSettingsOptions: () => SettingsOptionType[];
  studySettingsOptions: () => SettingsOptionType[];
  privacySettingsOptions: () => SettingsOptionType[];
  supportSettingsOptions: () => SettingsOptionType[];
  contentOfSelectedOption: () => ReactNode;
}

const mapSettingsOptions = new Map<string, SettingsOption>();
settingsOptions.forEach((option, index) => {
  mapSettingsOptions.set(option.title, index);
});

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider: FC<{ children?: ReactNode }> = (props) => {
  const [selectedOption, setSelectedOption] = useState<SettingsOption>(
    SettingsOption.DASHBOARD,
  );

  const handleSelectOption = (option: string) => {
    setSelectedOption(mapSettingsOptions.get(option)!);
  };

  const currentSelectedSettingOption = () => {
    return settingsOptions[selectedOption];
  };

  const profileSettingsOptions = () => {
    return settingsOptions.slice(0, 8);
  };

  const studySettingsOptions = () => {
    return settingsOptions.slice(8, 11);
  };

  const privacySettingsOptions = () => {
    return settingsOptions.slice(11, 13);
  };

  const supportSettingsOptions = () => {
    return settingsOptions.slice(13, 16);
  };

  const contentOfSelectedOption = () => {
    return settingsContent[selectedOption];
  };

  return (
    <SettingsContext.Provider
      value={{
        selectedOption,
        handleSelectOption,
        currentSelectedSettingOption,
        profileSettingsOptions,
        studySettingsOptions,
        privacySettingsOptions,
        supportSettingsOptions,
        contentOfSelectedOption,
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export { SettingsOption };
