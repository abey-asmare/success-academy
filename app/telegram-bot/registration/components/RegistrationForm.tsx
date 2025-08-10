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
import { Button } from "@/components/ui/button";

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
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      university: "",
      stream: "Natural science",
      referrer: "Telegram",
    
    },
  });

  return (
    <div className="max-w-2xl m-auto mt-10 px-10">
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(
            (data) => {
              console.log("triggered");
              startTransition(async () => {
                try {
                  toast.success("Profile updated successfully!");
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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
