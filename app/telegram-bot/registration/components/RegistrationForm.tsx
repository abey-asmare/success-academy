"use client";
import React, { startTransition } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { universities } from "@/lib/constants";
import { profileFormSchema } from "@/schemas/validationSchemas";
import toast from "react-hot-toast";
import { Course } from "@/prisma/app/generated/prisma/client";
import { TelegramFileUpload } from "@/components/file-upload";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { handleTelegramRegistration } from "./actions";

const referrerOptions = [
  { value: "Google", label: "Google" },
  { value: "Telegram", label: "Telegram" },
  { value: "Instagram", label: "Instagram" },
  { value: "Tiktok", label: "TikTok" },
  { value: "Youtube", label: "YouTube" },
  { value: "Friend", label: "Friend" },
  { value: "Other", label: "Other" },
];

const formSchema = profileFormSchema.extend({
    courseId: z.string().min(1, { message: "Course is required" }),
    imageUrl: z.url({ message: "Image URL is required" }),
    password: z.string().min(8, { message: "Password has to be at least 8 characters long" }),
});
type formType = z.infer<typeof formSchema>;


type PropType = {
    courses: Course[]
}

export default function RegistrationForm({courses}: PropType) {
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: '',
      password: '',  
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      university: "",
      stream: "Natural science",
      referrer: "Telegram",
      imageUrl: "",
    },
  });

  return (
    <div className="max-w-2xl m-auto my-10 px-6 transition-all">
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(
            (data) => {
              console.log("triggered");
              startTransition(async () => {
                console.log('data', data);
                try {
                  const res = await handleTelegramRegistration(data)
                  if (res?.status === 200) {
                    toast.success("Payment successful. We are processing your payments");
                  }
                } catch { 
                  toast.error("Failed to update profile. Please try again.");
                }
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
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4 justify-between">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="font-medium">Email *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email"
                      variant="custom"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="font-medium">Phone Number *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Phone Number"
                      variant="custom"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="font-medium">Password * (You&apos;ll use this to login to your account)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Password"
                      variant="custom"
                    />
                  </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
          {/* course  */}
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Course</FormLabel>
                <Select name={field.name} value={field.value} onValueChange={(value)=>field.onChange(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          {/* University */}
          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Where are you currently enrolled in?</FormLabel>
                <FormControl>
                  <Command {...field}>
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
                              form.reset({
                                ...form.getValues(),
                                university: university,
                              });
                            }}
                          >
                            {university}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </FormControl>
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
                </FormItem>
              )}
            />
          </div>
            <div className="mt-6 ">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Info</FormLabel>
                        <FormControl>
                          <TelegramFileUpload
                            endpoint="purchaseImageTelegram"
                            onChange={(url) => {
                              if (url) {
                                form.setValue("imageUrl", url);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 </div>
            <div className="mt-4">
            <Button className="bg-sky-600 hover:bg-sky-700 mb-10" type="submit" >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
