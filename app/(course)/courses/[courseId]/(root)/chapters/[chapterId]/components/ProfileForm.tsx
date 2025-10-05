"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { universities } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { profileFormSchema } from "@/schemas/validationSchemas";
import { useProfileEnroll } from "@/store";
import { useMediaQuery } from "@react-hook/media-query";
import { redirect, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { enrollInCourse } from "../actions";

const referrerOptions = [
  { value: "Google", label: "Google" },
  { value: "Telegram", label: "Telegram" },
  { value: "Instagram", label: "Instagram" },
  { value: "Tiktok", label: "TikTok" },
  { value: "Youtube", label: "YouTube" },
  { value: "Friend", label: "Friend" },
  { value: "Other", label: "Other" },
];

const formSchema = profileFormSchema;
type formType = z.infer<typeof formSchema>;

export default function ProfileDialogDrawerForm() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const open = useProfileEnroll((state) => state.open);
  const setOpen = useProfileEnroll((state) => state.setOpen);

  if (isDesktop) {
    return (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tell us about yourself</DialogTitle>
              <DialogDescription>
                While Processing your request, Tell us about yourself, This will
                help us to provide you with the best possible service.
              </DialogDescription>
            </DialogHeader>
            <ProfileForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="overflow-y-auto ">
        <ScrollArea className="p-4 max-h-[60vh] overflow-auto">
          <DrawerHeader className="text-left">
            <DrawerTitle>Tell us about yourself</DrawerTitle>
            <DrawerDescription>
              While Processing your request, Tell us about yourself, This will
              help us to provide you with the best possible service.
            </DrawerDescription>
          </DrawerHeader>
          <ProfileForm setOpen={setOpen} />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline" className="mx-6">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  // the user doesn't have an account he has to be redirected, since this page/form is protected
  //  hence if the user can see this form, he already have an account with us.
  const { user } = useUser();

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: "",
      email: user?.emailAddresses[0].emailAddress || "",
      university: "",
      stream: "Natural science",
      referrer: "Telegram",
    },
  });


  // useEffect(() => {
  //   if (user) {
  //     form.reset({
  //       firstName: user.firstName || "",
  //       lastName: user.lastName || "",
  //       email: user?.emailAddresses[0].emailAddress || "",
  //       phoneNumber: "",
  //       university: "",
  //       stream: "Natural science",
  //       referrer: "Telegram",
  //     });
  //   }
  // }, [user, form]);

  const params = useParams<{ courseId: string }>();
  const courseId = params?.courseId || "";
  console.log("courseid", courseId);

  return (
    <div className="max-w-2xl m-auto mt-10 px-10">
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(
            (data) => {
              console.log(data)
              startTransition(async () => {
                try {
                  console.log('data', data)
                  await enrollInCourse(data, courseId, user!.id);
                  toast.success("Profile updated successfully!");
                  setOpen(false);
                } catch {
                  toast.error("Failed to update profile. Please try again.");
                }
                redirect(`/courses/${courseId}/checkout`);
              });
            },
            (error) => console.log(error)
          )}
        >
          <div className="flex space-between gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="font-medium">First Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="First Name"
                      variant="custom"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="font-medium">Last Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Last Name"
                      variant="custom"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Phone Number *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Phone Number"
                    variant="custom"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* University */}
          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">University</FormLabel>
                <FormControl>
                  <Command {...field} >
                    <CommandInput placeholder="Search" value={field.value} />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="List of universities">
                        {universities.map((university) => (
                          <CommandItem
                            key={university}
                            value={university}
                            onSelect={() => {
                              form.setValue("university", university);
                            }}
                          >
                            {university}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 items-end">
            <FormField
              control={form.control}
              name="stream"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Stream</FormLabel>
                  <Select   onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a stream" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Natural science">
                        Natural science
                      </SelectItem>
                      <SelectItem value="Social science">
                        Social science
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Referrer */}
            <FormField
              control={form.control}
              name="referrer"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="">How did you hear about us?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="How did you hear about us?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {referrerOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4">
            <Button
              className={cn("bg-sky-600 hover:bg-sky-700", {
                "bg-sky-600/60": form.formState.isLoading,
              })}
              type="submit"
              disabled={form.formState.isLoading}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
