import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getContrastingColor, initialsToColor } from "@/utils/utils";
import { useClient } from "@/providers/client-provider";
import React from "react";
import { Spinner } from "@/components/ui/spinner";

export const ClientAvatar = ({
  width,
  height,
}: {
  width: string;
  height: string;
}) => {
  const { name, avatar, isLoading } = useClient();
  if (isLoading) {
    return <Spinner />;
  }
  const initials = name?.split(" ").map((n) => n[0].toUpperCase());
  const backgroundColor = initialsToColor(initials?.join("") || "");
  return (
    <Avatar
      style={{
        width: width,
        height: height,
      }}
    >
      <AvatarImage src={avatar} />
      <AvatarFallback
        style={{
          backgroundColor,
          color: getContrastingColor(backgroundColor),
        }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
