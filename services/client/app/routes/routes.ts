import { FaEnvelope, FaHome, FaTachometerAlt, FaUpload } from "react-icons/fa";
import type { IconType } from "react-icons";

interface Link {
  name: string;
  to: string;
  id: number;
  icon: IconType;
}

export const routesLinks = [
  { name: "Home", to: "/", id: 1, icon: FaHome },
  { name: "Dashboard", to: "/dashboard", id: 2, icon: FaTachometerAlt },
  { name: "Upload", to: "/dashboard/upload", id: 3, icon: FaUpload },
  { name: "Contact", to: "/contact", id: 4, icon: FaEnvelope },
];
