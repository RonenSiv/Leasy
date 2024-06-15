import React from "react";
import { Header } from "@/components/ui/header";
import { Text } from "@/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ImageUp, Pencil } from "lucide-react";
import { FormField } from "@/components/Forms/FormField";
import { useForm } from "react-hook-form";
import { ProfileSchema, profileSchema } from "@/lib/schemas/useFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SettingsAccountImage = () => {
  return (
    <div className={"relative flex h-full w-full justify-center items-center"}>
      <Avatar className={"h-full w-full"}>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size={"sm"}
            className={"absolute bottom-2 left-0 flex gap-1"}
          >
            <Pencil />
            <Text size={"sm"}>Edit</Text>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem className={"flex gap-2"}>
              <ImageUp />
              <Text size={"sm"}>Upload new image</Text>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const Dialogs = ({
  dialogOpen,
  handleDialog,
  dialogType,
}: {
  dialogOpen: {
    emailChange: boolean;
    passwordChange: boolean;
    confirmation: boolean;
    alert: boolean;
  };
  handleDialog: (dialogType: string, value: boolean) => void;
  dialogType: string;
}) => {
  const handleEmailChangeConfirm = () => {
    handleDialog("alert", false);
    handleDialog("emailChange", true);
  };

  const handleSubmitChangeEmail = () => {
    handleDialog("emailChange", false);
    handleDialog("confirmation", true);
  };

  const handlePasswordChange = () => {
    handleDialog("alert", false);
    handleDialog("passwordChange", true);
  };

  const handleSubmitChangePassword = () => {
    handleDialog("passwordChange", false);
    handleDialog("confirmation", true);
  };

  return (
    <>
      <AlertDialog
        open={dialogOpen.alert}
        onOpenChange={(open) => handleDialog("alert", open)}
      >
        <AlertDialogTrigger asChild>
          <span />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will change your{" "}
              {dialogType === "password" ? "password" : "email address"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleDialog("alert", false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                dialogType === "password"
                  ? handlePasswordChange()
                  : handleEmailChangeConfirm()
              }
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={dialogOpen.emailChange}
        onOpenChange={(open) => handleDialog("emailChange", open)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change email address</DialogTitle>
            <DialogDescription>
              Make sure you have access to your new email address before
              updating it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="old-email" className="text-right">
                Old Email
              </Label>
              <Input
                id="old-email"
                type={"email"}
                placeholder="your@email.com"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-email" className="text-right">
                New Email
              </Label>
              <Input
                id="new-email"
                type={"email"}
                placeholder="new@email.com"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type={"password"}
                placeholder="password"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmitChangeEmail}>
              Change email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogOpen.passwordChange}
        onOpenChange={(open) => handleDialog("passwordChange", open)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              Make sure you have access to your current password before updating
              it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="old-password" className="text-right">
                Old Password
              </Label>
              <Input
                id="old-password"
                type={"password"}
                placeholder="Enter your current password"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">
                New Password
              </Label>
              <Input
                id="new-password"
                type={"password"}
                placeholder="Enter your new password"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmitChangePassword}>
              Change password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogOpen.confirmation}
        onOpenChange={(open) => handleDialog("confirmation", open)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "email" ? "Email" : "Password"} has been changed!
            </DialogTitle>
            <DialogDescription>
              You have successfully changed your{" "}
              {dialogType === "email" ? "email" : "password"}. You will be
              logged out and need to log in again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={() => {
                  handleDialog("confirmation", false);
                  handleDialog("emailChange", false);
                }}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const EmailChangeButton = ({
  handleAlertDialog,
}: {
  handleAlertDialog: (value: boolean) => void;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="absolute inset-y-0 right-0 pr-3 mt-1 flex items-center hover:cursor-pointer z-50"
          onClick={() => handleAlertDialog(true)}
        >
          <LiaExchangeAltSolid />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Click here to change your email address.</p>
      </TooltipContent>
    </Tooltip>
  );
};

const PasswordChangeButton = ({
  handleAlertDialog,
}: {
  handleAlertDialog: (value: boolean) => void;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="absolute inset-y-0 right-0 pr-3 mt-1 flex items-center hover:cursor-pointer z-50"
          onClick={() => handleAlertDialog(true)}
        >
          <LiaExchangeAltSolid />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Click here to change your password.</p>
      </TooltipContent>
    </Tooltip>
  );
};

const SettingsAccountDetails = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      bio: "",
      email: "",
      password: "",
    },
  });
  const [dialogOpen, setDialogOpen] = React.useState({
    emailChange: false,
    passwordChange: false,
    confirmation: false,
    alert: false,
  });
  const [dialogType, setDialogType] = React.useState("");
  const handleDialog = (dialogType: string, value: boolean) => {
    setDialogOpen((prevState) => ({ ...prevState, [dialogType]: value }));
  };

  return (
    <form className={"flex flex-col gap-2 max-w-md"}>
      <FormField name={"name"} label={"Name"} register={register("fullName")} />
      <Label htmlFor="bio" className="text-sm font-medium">
        Bio
      </Label>
      <Textarea
        id={"bio"}
        placeholder={"Tell us about yourself."}
        {...register("bio")}
      />
      <div className="relative flex justify-center items-center h-full">
        <FormField
          name={"email"}
          label={"Email"}
          register={register("email")}
          type={"email"}
          placeholder={"your@email.com"}
          disabled
        />
        <EmailChangeButton
          handleAlertDialog={(value) => {
            setDialogType("email");
            handleDialog("alert", value);
          }}
        />
      </div>
      <div className="relative flex justify-center items-center h-full">
        <FormField
          name={"password"}
          label={"Password"}
          register={register("password")}
          type={"password"}
          placeholder={"password"}
          disabled
        />
        <PasswordChangeButton
          handleAlertDialog={(value) => {
            setDialogType("password");
            handleDialog("alert", value);
          }}
        />
      </div>
      <Button type={"submit"} form={"profile"} className={"self-start mt-4"}>
        Update profile
      </Button>
      <Dialogs
        dialogOpen={dialogOpen}
        handleDialog={handleDialog}
        dialogType={dialogType}
      />
    </form>
  );
};

export const SettingsAccount = () => {
  return (
    <div className={"flex flex-col w-full h-full gap-2"}>
      <Header size={"lg"}>Account settings</Header>
      <div className={"flex flex-row"}>
        <div className={"flex-1 max-w-lg"}>
          <SettingsAccountDetails />
        </div>
        <div className="flex w-[200px] h-[200px] flex-col gap-2 ">
          <Text>Profile picture</Text>
          <SettingsAccountImage />
        </div>
      </div>
    </div>
  );
};
