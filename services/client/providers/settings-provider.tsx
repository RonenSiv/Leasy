"use client";

import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { MdOutlineCookie, MdOutlineSpaceDashboard } from "react-icons/md";
import { LiaUser } from "react-icons/lia";
import { HiOutlinePaintBrush } from "react-icons/hi2";
import {
  IoAccessibilityOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { FaRegComments, FaRegStickyNote } from "react-icons/fa";
import { GrOverview } from "react-icons/gr";
import { GiArtificialIntelligence } from "react-icons/gi";
import { RiCustomerService2Line } from "react-icons/ri";
import { DataTable } from "@/components/settings/dashboard-table";
import { SettingsAccount } from "@/components/settings/settings-account";
import AppearanceSettings from "@/components/settings/settings-appearance";
import AccessibilitySettings from "@/components/settings/settings-accessibility";
import SecuritySettings from "@/components/settings/settings-security";
import StudyNotes from "@/components/settings/settings-study-notes";
import { StudyOverview } from "@/components/settings/settings-study-overview";
import { AISettings } from "@/components/settings/settings-ai";
import { ManageCookies } from "@/components/settings/settings-cookies";
import { HelpAndSupport } from "@/components/settings/settings-support";
import { Feedback } from "@/components/settings/settings-feedback";

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
  { title: "Studying Notes", icon: <FaRegStickyNote /> },
  { title: "Study Overview", icon: <GrOverview /> },
  { title: "AI Settings", icon: <GiArtificialIntelligence /> },
  { title: "Manage Cookies", icon: <MdOutlineCookie /> },
  { title: "Help & Support", icon: <RiCustomerService2Line /> },
  { title: "Feedback", icon: <FaRegComments /> },
];

const settingsContent: ReactNode[] = [
  <DataTable key={1} />,
  <SettingsAccount key={2} />,
  <AppearanceSettings key={3} />,
  <AccessibilitySettings key={4} />,
  <SecuritySettings key={5} />,
  <StudyNotes key={6} />,
  <StudyOverview key={7} />,
  <AISettings key={8} />,
  <ManageCookies key={9} />,
  <HelpAndSupport key={10} />,
  <Feedback key={11} />,
];

enum SettingsOption {
  DASHBOARD,
  ACCOUNT,
  APPEARANCE,
  ACCESSIBILITY,
  SECURITY,
  NOTIFICATION_SETTINGS,
  LANGUAGE_PREFERENCES,
  STUDYING_NOTES,
  STUDY_OVERVIEW,
  AI_SETTINGS,
  POLICY,
  MANAGE_COOKIES,
  HELP_AND_SUPPORT,
  FEEDBACK,
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
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Set initial state based on URL hash
    const hash = window.location.hash.slice(1);
    const option = settingsOptions.find(
      (opt) => opt.title.toLowerCase().replace(/\s+/g, "-") === hash,
    );
    if (option) {
      setSelectedOption(mapSettingsOptions.get(option.title)!);
    }
    setIsLoading(false);
  }, []);

  const handleSelectOption = (option: string) => {
    setSelectedOption(mapSettingsOptions.get(option)!);
    // Update URL with anchor
    const anchor = option.toLowerCase().replace(/\s+/g, "-");
    window.history.pushState(null, "", `#${anchor}`);
  };

  const currentSelectedSettingOption = () => {
    return settingsOptions[selectedOption];
  };

  const profileSettingsOptions = () => {
    return settingsOptions.slice(0, 5);
  };

  const studySettingsOptions = () => {
    return settingsOptions.slice(5, 8);
  };

  const privacySettingsOptions = () => {
    return settingsOptions.slice(8, 9);
  };

  const supportSettingsOptions = () => {
    return settingsOptions.slice(9, 11);
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
        isLoading,
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
