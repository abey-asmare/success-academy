"use client";
import { UploadPurchaseDropzoneProgress } from "@/components/UploadPurchaseDropzoneProgress";
import { accounts } from "@/lib/constants";
import { useUploadFiles } from "@better-upload/client";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { courseId } = useParams();
  const router = useRouter();

    const { control} = useUploadFiles({
      route: "coursePurchase",
      onUploadComplete: (data)=> {
        onSubmit({imageUrl: data.files[0].objectInfo.key})
      }
    });
  const onSubmit = async ({ imageUrl }: { imageUrl: string }) => {
    try {
      await axios.post(`/api/courses/${courseId}/purchase`, { imageUrl });
      toast.success("Payment successful. We are processing your payments");
      setTimeout(() => {
        router.push(`/courses/${courseId}`);
      }, 600);
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center px-10">
      <h1 className="text-sm md:text-2xl font-semibold w-[40ch] mb-6">
        After you transferred, please upload an image, it may take a few minutes
        to process
      </h1>
      <div className="flex justify-center items-center gap-12 flex-col md:flex-row ">
        <div className="space-y-4">
          {accounts.map((account) => (
            <CardItem key={account.name} {...account} />
          ))}
        </div>
        {/* divider */}
        <div className="w-0.5  h-72 rounded-full bg-gray-200 hidden md:block" />
        <div>
          {/* <FileUpload/> */}
          <div className="mt-6 ">
            <div>
              {/* <FileUpload
                endpoint="purchaseImage"
                onChange={(url) => {
                  if (url) {
                    onSubmit({ imageUrl: url });
                  }
                }}
              /> */}

                {/* <UploadDropzoneProgress control={control} accept="image/*" /> */}
                <UploadPurchaseDropzoneProgress control={control} accept="image/*" />
            </div>
          </div>
        </div>
      </div>
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
  );
}
