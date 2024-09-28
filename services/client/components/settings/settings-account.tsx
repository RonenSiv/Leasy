import React from "react";
import { Header } from "@/components/ui/header";
import { Text } from "@/components/ui/text";
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
import { FormField } from "@/components/Forms/form-field";
import { FieldValues, useForm } from "react-hook-form";
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
import { useClient } from "@/providers/client-provider";
import { ClientAvatar } from "@/components/client-avatar";
import { imageSchema } from "@/lib/schemas/useImageSchema";
import { Spinner } from "@/components/ui/spinner";
import FileInput from "@/components/ui/file-input";

const SettingsAccountImage = () => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(imageSchema),
  });
  type ImageFormData = {
    image: FileList;
  };

  const handleImageUpload = async (data: FieldValues) => {
    setLoading(true);
    try {
      console.log("Uploading image...", data.image[0]);
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Image uploaded successfully");
      reset();
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className={"relative flex h-full w-full justify-center items-center"}>
      <ClientAvatar width={"200px"} height={"200px"} />
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
            <DropdownMenuItem
              className={"flex gap-2"}
              onClick={() => setOpen(true)}
            >
              <ImageUp />
              <Text size={"sm"}>Upload new image</Text>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog Modal for Image Upload */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg p-6 shadow-xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-semibold">
              Upload New Profile Picture
            </DialogTitle>
            <DialogDescription className="text-sm">
              Select a new image file to update your profile picture. Supported
              formats: JPG, PNG.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleImageUpload)} id="image-upload">
            <div>
              <Label htmlFor="image-upload" className="text-sm font-medium">
                Choose Image
              </Label>
              <FileInput
                id="image-upload"
                accept="image/*"
                onChange={(files) => {
                  console.log("Selected image", files);
                }}
                register={register("image")}
                disabled={loading}
              />
              {errors.image && (
                <p className="text-sm text-red-600 mt-1">
                  {/* @ts-ignore */}
                  {errors?.image?.message}
                </p>
              )}
            </div>
            <DialogFooter className="flex justify-end space-x-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={loading}
                className="relative"
              >
                {loading && <Spinner />}
                {loading ? "Uploading..." : "Upload Image"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
        <span>Click here to change your email address.</span>
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
        <span>Click here to change your password.</span>
      </TooltipContent>
    </Tooltip>
  );
};

const SettingsAccountDetails = () => {
  const { name, email, bio } = useClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: name,
      bio: bio,
      email: email,
      password: "*********",
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
