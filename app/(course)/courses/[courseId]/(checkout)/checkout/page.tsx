'use client'
import React, { useState } from "react";
import Image from "next/image";
import {accounts} from '@/lib/constants'  
import { useParams } from "next/navigation";
import { FileUpload } from "@/components/file-upload";
import axios from "axios";
import toast from "react-hot-toast";
import * as z from "zod";
import { useRouter } from "next/navigation";



export default  function CheckoutPage() {
  const { courseId } = useParams();
  const router = useRouter();
      const onSubmit = async ({imageUrl}: {imageUrl: string}) => {
        try {
          await axios.post(`/api/courses/${courseId}/purchase`, {imageUrl});
          toast.success("Course updated");
          // router.refresh();
          router.push(`/courses/${courseId}`);
        } catch {
          toast.error("Something went wrong");
        }
        }
  

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center ">
      <h1 className="text-2xl font-semibold">After you transferred, please upload an image, it may take a few minutes to process</h1>
     <div className="flex  justify-center items-center gap-12 ">
     <div className="space-y-4">
        {accounts.map(account => {

  return        <CardItem key={account.name} {...account} />
        })}
        
      </div>
      <div className="w-0.5  h-72 rounded-full bg-gray-200"></div>
      <div>
    {/* <FileUpload/> */}
    <div className="mt-6 ">
        <div>
          <FileUpload
          endpoint="purchaseImage"
          onChange={(url) => {
            if (url) {
                onSubmit({ imageUrl: url });
            }
          }}
        />
        </div>
    </div>
      </div>
     </div>
    </div>
  );
}

interface CardItemProps {
  name: string,
   image: string,
    accountHolder: string,
     accountNumber: string
    }
function CardItem({name, image, accountHolder, accountNumber}: CardItemProps){
  return (
    <div>
          <div className="flex items-center gap-x-2">
            <Image
              src={image}
              className="w-8 h-8"
              alt={name}
              width={2000}
              height={1958}
            />
            <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
          </div>
          <p className="text-gray-600 font-semibold text-md ml-4 space-x-2 flex flex-col">
            <span>Account Holder: {accountHolder}</span>
            <span className="text-sky-600">Account Number: {accountNumber}</span>
          </p>
        </div>
  )
}


