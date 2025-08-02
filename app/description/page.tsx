'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {Form, FormField, FormItem, FormLabel} from "@/components/ui/form";

import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import z from 'zod'
import { UPLOAD_SIZE_LIMIT, sampleCourse, paymentAccounts } from "../constants";
import { formatPrice } from "@/lib/format";
  
const accounts = z.enum(paymentAccounts.map(account => account.id), {message: 'Please select a payment account'})

// Zod validation schema
const paymentFormSchema = z.object({
    accounts: accounts,
    receiptFile: z.file({message: 'Please upload a payment receipt'})
                .max(UPLOAD_SIZE_LIMIT, 'File size should be less than 5MB')
                .mime(['image/jpeg', 'image/png', 'application/pdf'], 'Please upload only images (JPEG, PNG) or PDF files')
})

type paymeentFormType = z.infer<typeof paymentFormSchema>

export default function DescriptionPage() {



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2">{sampleCourse.title}</h1>
            <p className="text-blue-100 text-lg">{sampleCourse.description}</p>
          </div>
          
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{sampleCourse.duration}</div>
                <div className="text-gray-600">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{sampleCourse.level}</div>
                <div className="text-gray-600">Level</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{formatPrice(sampleCourse.price)}</div>
                <div className="text-gray-600">Price</div>
              </div>
            </div>
            <div className="accounts">
                <p>Success Academy</p>
                {paymentAccounts.map(account => 
                    <p key={account.id} className="text-gray-600">{account.bankName}: {account.accountNumber}</p>
                )}
                  <Dialog>
    <DialogTrigger
    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2">Enroll Now - Pay {formatPrice(sampleCourse.price)}
    </DialogTrigger>

    <DialogContent>

                <SubmitPaymentForm/>
        </DialogContent>
        </Dialog>    
            </div>
          </div>
        </div>

        {/* Course Features */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What You&apos;ll Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleCourse.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Curriculum */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
          <div className="space-y-3">
            {sampleCourse.curriculum.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}

function SubmitPaymentForm() {
    const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

    const onSubmit = async (data: paymeentFormType) => {
      try {
          console.log("Payment data:", data)
        if (dialogCloseRef.current) {
          dialogCloseRef.current.click();
        }
      } catch {
      }
    };
  const form = useForm<paymeentFormType>({resolver: zodResolver(paymentFormSchema)})
    return (
  
        <Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
        <DialogTitle>Attach Payment Receipt</DialogTitle>
        <DialogDescription className="space-y-6">

            <p className="title">Please attach a payment receipt to complete your enrollment.</p>
            <div className="paymentbank space-y-2">

                {form.formState.errors.accounts && <p className="text-red-500">{form.formState.errors.accounts.message}</p>}
                <FormField
                control={form.control}
                name="accounts"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Select Payment Bank</FormLabel>
                        <Select {...field}  onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Payment Bank" />
                            </SelectTrigger>
                            <SelectContent>

                                {paymentAccounts.map(account => (
                                    <SelectItem  key={account.id} value={account.id}>{account.bankName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
                />
            </div>
            <div className="receipt space-y-2">
    <FormField 
                control={form.control}
                name="receiptFile"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Picture</FormLabel>
                    <Input
                        id="receipt"
                        type="file"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                    {form.formState.errors.receiptFile && (
                        <p className="text-red-500">{form.formState.errors.receiptFile.message}</p>
                    )}
                    </FormItem>
                )}
                />
            </div>

        </DialogDescription>
        </DialogHeader>
        <DialogFooter className="space-x-2 mt-4" >
        <DialogClose asChild><Button  variant='outline' ref={dialogCloseRef}>Cancel</Button></DialogClose>
        <Button className="bg-primary-500 hover:bg-primary-500/90" type="submit">Submit</Button>
        </DialogFooter>
    </form>
    </Form>

    )
}