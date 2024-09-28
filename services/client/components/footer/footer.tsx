import Link from "next/link";

import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa6";
import {
  FACEBOOK_LINK,
  GITHUB_LINK,
  INSTAGRAM_LINK,
  LINKEDIN_LINK,
  TWITTER_LINK,
} from "@/constants/footer-links";
import { Separator } from "@/components/ui/separator";
import React from "react";

export const NAVIGATION_LINKS = [
  { name: "About", link: "#" },
  { name: "Team", link: "#" },
  { name: "Contact", link: "#" },
  { name: "Terms", link: "#" },
];

export const SOCIAL_MEDIA = [
  { name: "Facebook", icon: FaFacebook, link: FACEBOOK_LINK },
  { name: "Twitter", icon: FaTwitter, link: TWITTER_LINK },
  { name: "Instagram", icon: FaInstagram, link: INSTAGRAM_LINK },
  { name: "LinkedIn", icon: FaLinkedin, link: LINKEDIN_LINK },
  { name: "GitHub", icon: FaGithub, link: GITHUB_LINK },
];

export const Footer = () => {
  return (
    <section>
      <Separator
        className="w-full h-0.5 mx-auto bg-foreground opacity-30"
        style={{
          minWidth: "600px",
        }}
      />
      <div className="max-w-screen-xl px-4 py-6 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center -mx-5 -my-2">
          {" "}
          {NAVIGATION_LINKS.map((link) => (
            <div className="px-5 py-2" key={link.name}>
              <Link
                href={link.link}
                className="text-base leading-6 opacity-70 hover:opacity-100"
              >
                {link.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className="flex justify-center mt-8 space-x-6">
          {SOCIAL_MEDIA.map((social) => (
            <Link
              key={social.name}
              href={social?.link}
              className="text-base leading-6 opacity-70 hover:opacity-100"
            >
              <social.icon className="w-6 h-6" />
            </Link>
          ))}
        </div>
        <p className="mt-8 text-base leading-6 text-center opacity-70">
          © 2024 Leasy. All rights reserved.
        </p>
      </div>
    </section>
  );
};
