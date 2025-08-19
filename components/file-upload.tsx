'use client';

import { ourFileRouter } from "@/app/api/uploadthing/core";
  import { UploadDropzone } from "@/lib/uploadthing";
import toast from "react-hot-toast";

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
}

export const FileUpload= ({
    onChange, endpoint
}: FileUploadProps) => {
    return <UploadDropzone
    endpoint={endpoint}
    onUploadProgress={(progress)=> {
        if(endpoint === "chapterVideo") console.log('video updating progress', progress)
    }}
    onClientUploadComplete={(res)=> {
        onChange(res?.[0].ufsUrl)
    }}
    onUploadError={(error: Error)=> {
        toast.error(error.message)
    }}
    />
}


interface TelegramFileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
    disabled?: boolean;
}
export const TelegramFileUpload= ({
    onChange, endpoint, disabled
}: TelegramFileUploadProps) => {
    return <UploadDropzone
    endpoint={endpoint}
    disabled={disabled}
    onClientUploadComplete={(res)=> {
        onChange(res?.[0].ufsUrl)
        toast.success("File uploaded successfully")

    }}
    onUploadError={(error: Error)=> {
        toast.error(error.message)
    }}
    />
}


interface FileAttachmentUploadProps {
    onChange: (values: {url: string, type: string | undefined, name: string | undefined}[]) => void;
    endpoint: keyof typeof ourFileRouter;
}
export const FileAttachmentUpload = ({
    onChange, endpoint
}: FileAttachmentUploadProps) => {
    return <UploadDropzone
    endpoint={endpoint}
    onClientUploadComplete={(res)=> {
        onChange(res?.map((file) => ({url: file.ufsUrl, type: file.type, name: file.name})))
    }}
    onUploadError={(error: Error)=> {
        toast.error(error.message)
    }}
    />
}