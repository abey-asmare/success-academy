"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { accounts, universities } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { Prisma } from "@/prisma/app/generated/prisma/client";
import { profileFormSchema } from "@/schemas/validationSchemas";
import Image from "next/image";
import toast from "react-hot-toast";
import { handleTelegramRegistration } from "./actions";

import { useUploadFiles } from "@better-upload/client";
import { UploadPurchaseDropzoneProgress } from "@/components/UploadPurchaseDropzoneProgress";

import type WebApp from "@twa-dev/sdk";
import Link from "next/link";
import FancyBoxWrapper from "@/components/FancyBoxWrapper";
import { Edit } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

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
  imageUrl: z.string().min(1, { message: "Image URL is required" }),
});
type formType = z.infer<typeof formSchema>;

type PropType = {
  courses: Prisma.CourseGetPayload<{ include: { promocodes: true } }>[];
};

export default function RegistrationForm({ courses }: PropType) {
  const telegramAppRef = useRef<typeof WebApp | null>(null);

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
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

    const [promo, setPromo] = useState("");
  const [editImage, setEditImage] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const { control } = useUploadFiles({
    route: "coursePurchaseTelegram",
    onUploadComplete: (data) => {
      console.log("uploading", data)
        const uploadedFileKey = data.files[0].objectInfo.key;

  const fullUrl = `${process.env.NEXT_PUBLIC_EXPOSE_CONTENT_THROUGH}/${uploadedFileKey}`;
      setImgUrl(fullUrl);
      setEditImage(false);
      console.log("uploaded", uploadedFileKey)
      form.setValue("imageUrl", uploadedFileKey);
    },
    onError: (error) => {
      Sentry.captureException(error);
    },
  });

  useEffect(() => {
    (async () => {
      const { default: WebApp } = await import("@twa-dev/sdk");
      const tWebapp = WebApp as typeof WebApp;
      telegramAppRef.current = tWebapp;
      if (telegramAppRef.current?.initDataUnsafe.user) {
        form.setValue(
          "firstName",
          telegramAppRef.current.initDataUnsafe.user.first_name || ""
        );
        form.setValue(
          "lastName",
          telegramAppRef.current.initDataUnsafe.user.last_name || ""
        );
      }
      if (telegramAppRef.current) {
        telegramAppRef.current.requestFullscreen();
        telegramAppRef.current.ready();
      }
    })();
  }, []);
  const getCurrentPrice = () => {
    const selectedCourse = form.watch("courseId");
    const course = courses.find((course) => course.id === selectedCourse);
    if (!course || !course.price) return;

    const promocode = course?.promocodes.find(
      (p) => p.code.toLowerCase() === promo.toLowerCase()
    );
    return {
      price: course.price,
      discount: promocode?.discount || 0,
      finalPrice: promocode?.discount
        ? course.price - (course.price * promocode.discount) / 100
        : course.price,
    };
  };
  

  return (
    <div className="max-w-2xl m-auto my-10 px-6 transition-all">
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (data) => {
            await toast
              .promise(handleTelegramRegistration(data), {
                loading: "Processing your payment...",
                success: "Payment successful. We are processing your payments",
                error: "Something went wrong",
              })
              .then(() => {
                telegramAppRef.current?.showAlert(
                  "Payment successful. The admin will approve your payment in less than a 2 minutes."
                );
                setTimeout(() => telegramAppRef.current?.close(), 1000);
              });
          })}
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
                    <Input {...field} placeholder="Email" variant="custom" />
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

          {/* course  */}
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Course</FormLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
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
                <FormLabel className="">
                  Where are you currently enrolled in?
                </FormLabel>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
          <Label>Promo code</Label>
          <Input
            variant="custom"
            placeholder="Promo code"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
          />

          <div className="mt-6 ">
            <p className="font-semibold color-[#181818]">
              Amount{" "}
              <span className="text-gray-600 ml-2">
                {getCurrentPrice()?.finalPrice ? "" : "Select a course first"}
              </span>
              {getCurrentPrice()?.finalPrice ? (
                <span>
                  {formatPrice(getCurrentPrice()?.finalPrice || 0)}{" "}
                  <sup className="text-red-600">
                    {getCurrentPrice()?.discount
                      ? `${getCurrentPrice()?.discount}% off`
                      : ""}
                  </sup>
                </span>
              ) : (
                ""
              )}
            </p>
            <div className="space-y-4">
              {accounts.map((account) => (
                <CardItem key={account.name} {...account} />
              ))}
            </div>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">Payment Info {imgUrl && <Edit onClick={() => setEditImage(true)} className="ml-2 cursor-pointer text-sky-600 size-4"/>}</FormLabel>

                  <FormControl>
        <div className="w-full h-54 relative object-cover rounded-md overflow-hidden">
                   {imgUrl && !editImage ? <FancyBoxWrapper className="w-full h-full">
                   <Link
                    data-fancybox
                      href={imgUrl}
                      className="w-full h-full"
                    >
                    <Image
                    src={imgUrl}
                    alt="payment info"
                    fill
                    objectFit="cover"
                    />
                    </Link>
                    </FancyBoxWrapper>
                    : <UploadPurchaseDropzoneProgress
                      control={control}
                      accept="image/*"
                      isSubmitting={form.formState.isSubmitting}

                      // onChange={(url) => {
                      //   if (url) {
                      //     form.setValue("imageUrl", url);
                      //   }
                      // }}
                      
                      />
                   }   </div>
                    {/* <TelegramFileUpload
                      endpoint="purchaseImageTelegram"
                      onChange={(url) => {
                        console.log(url)
                        console.log('on change called')
                        if (url) {
                          form.setValue("imageUrl", url);
                        }
                      }}
                    /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4">
            <Button
              className="bg-sky-600 hover:bg-sky-700 mb-10"
              type="submit"
              disabled={form.formState.isSubmitting || form.formState.isLoading}
            >
              {form.formState.isSubmitting
                ? "Submitting"
                : `${
                    getCurrentPrice()?.finalPrice
                      ? `I Paid ${formatPrice(
                          getCurrentPrice()?.finalPrice || 0
                        )}`
                      : "Submit"
                  }`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface CardItemProps {
  name: string;
  image: string;
  accountHolder: string;
  accountNumber: string;
}
function CardItem({
  name,
  image,
  accountHolder,
  accountNumber,
}: CardItemProps) {
  return (
    <div className="my-2">
      <div className="flex items-center gap-x-2">
        <Image
          src={image}
          className="w-8 h-8"
          alt={name}
          width={2000}
          height={1958}
        />
        <h1 className="text-xl font-bold text-gray-800">{name}</h1>
      </div>
      <p className="text-gray-600 font-semibold text-sm ml-4 space-x-2 flex flex-col">
        <span>Account Holder: {accountHolder}</span>
        <span className="text-sky-600 text-sm">
          Account Number: {accountNumber}
        </span>
      </p>
    </div>
  );
}
