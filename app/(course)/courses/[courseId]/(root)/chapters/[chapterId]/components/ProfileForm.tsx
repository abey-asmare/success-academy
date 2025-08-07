"use client";
import React, { startTransition, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import {useMediaQuery} from "@react-hook/media-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { universities } from "@/lib/constants";
import { useProfileEnroll } from "@/store";
import { profileFormSchema } from "@/schemas/validationSchemas";
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

const formSchema = profileFormSchema
type formType = z.infer<typeof formSchema>;

export default function ProfileDialogDrawerForm({onSuccess}: {onSuccess: ()=> void}){
  const isDesktop = useMediaQuery("(min-width: 768px)")
  
  const open = useProfileEnroll(state => state.open)
  const setOpen = useProfileEnroll(state => state.setOpen)

  if (isDesktop) {
    return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tell us about yourself</DialogTitle>
            <DialogDescription>
              While Processing your request, Tell us about yourself, This will help us to provide you with the best possible service.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm onSuccess = {onSuccess} />
        </DialogContent>
      </Dialog></>
    )
  }



  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Tell us about yourself</DrawerTitle>
          <DrawerDescription>
            While Processing your request, Tell us about yourself, This will help us to provide you with the best possible service.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm onSuccess = {onSuccess} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}




function ProfileForm({onSuccess}: {onSuccess: ()=> void}) {
  
  const { isLoaded, isSignedIn, user } = useUser();


  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: "",
      university: "",
      stream: "Natural science",
      referrer: "Telegram",
    },
  });

   useEffect(() => {
      if (user) {
        form.reset({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phoneNumber: "",
          university: "",
          stream: "Natural science",
          referrer: "Telegram",
        });
      }
    }, [user, form]);
    
  return (
    <div className="max-w-2xl m-auto mt-10 px-10">
      <Form {...form} >
        <form 
          className="space-y-4"
          onSubmit={form.handleSubmit(
            (data) => {
              startTransition(() => {
                enrollInCourse(data)
              })  
            }
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
                  <Input {...field} placeholder="First Name" variant="custom" />
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
                  <Input {...field} placeholder="Last Name" variant="custom" />
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
                            <Command>
              <CommandInput  placeholder="Search"  {...field}/>
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="List of universities">
                {universities.map((university) => (
                  <CommandItem key={university} value={university} onSelect={(value)=>{
                    form.setValue("university", university)
                    console.log(value, 'value')
                    console.log(form, 'form')
                    form.reset({...form.getValues(), university: university})
                  }}>
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
                  <Select {...field}>
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
            <Button className="bg-sky-600 hover:bg-sky-700" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
