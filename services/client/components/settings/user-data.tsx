import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const UserData = () => {
  return (
    <div className={"flex h-full items-start gap-4"}>
      <Avatar className={"h-16 w-16"}>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className={"flex flex-col"}>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Username
        </h3>
        <p className="scroll-m-20 text-gray-500 dark:text-gray-400">
          Your personal data
        </p>
      </div>
    </div>
  );
};
