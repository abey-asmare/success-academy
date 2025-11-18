import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { UploadHookControl } from "@better-upload/client";
import { Ban, Upload } from "lucide-react";
import { useId } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";


type UploadHLSDropzoneProgressProps = {
  control: UploadHookControl<true>;
  id?: string;
  accept?: string;
  metadata?: Record<string, unknown>;
  description?:
    | {
        fileTypes?: string;
        maxFileSize?: string;
        maxFiles?: number;
      }
    | string;
  uploadOverride?: (
    ...args: Parameters<UploadHookControl<true>["upload"]>
  ) => void;
};

export default function UploadHLSDropzoneProgress({
  control: { upload, isPending, progresses, averageProgress },
  id: _id,
  accept,
  metadata,
  description,
  uploadOverride,
}: UploadHLSDropzoneProgressProps) {
  const id = useId();

  const { getRootProps, getInputProps, isDragActive, inputRef, open } =
    useDropzone({
      onDrop: (files) => {
        if (files.length > 0) {
          if (uploadOverride) {
            uploadOverride(files, { metadata });
          } else {
            upload(files, { metadata });
          }
          inputRef.current.value = "";
        }
      },
      noClick: true,
      multiple: true,
    });

  return (
    <div className="text-foreground flex flex-col gap-3">
      <div
        className={cn(
          "relative rounded-lg border border-dashed transition-colors h-54",
          {
            "border-primary/80": isDragActive,
          }
        )}
      >
        <label
          {...getRootProps()}
          className={cn(
            "dark:bg-input/10 flex w-full min-w-72 cursor-pointer flex-col items-center justify-center rounded-lg bg-transparent px-2 py-6 transition-colors h-full",
            {
              "text-muted-foreground cursor-not-allowed": isPending,
              "hover:bg-accent dark:hover:bg-accent/40": !isPending,
              "opacity-0": isDragActive,
            }
          )}
          htmlFor={_id || id}
        >
          <div className="my-2">
            <Upload className="size-6" />
          </div>

          <div className="mt-3 space-y-1 text-center flex flex-col items-center">
            <p className="text-sm font-semibold">Drag and drop files here (.m3u8 & .ts)</p>

            <p className="text-muted-foreground max-w-64 text-xs">
              {typeof description === "string" ? (
                description
              ) : (
                <>
                  {description?.maxFiles &&
                    `You can upload ${description.maxFiles} file${
                      description.maxFiles !== 1 ? "s" : ""
                    }.`}{" "}
                  {description?.maxFileSize &&
                    `${description.maxFiles !== 1 ? "Each u" : "U"}p to ${
                      description.maxFileSize
                    }.`}{" "}
                  {description?.fileTypes &&
                    `Accepted ${description.fileTypes}.`}
                </>
              )}
            </p>
            <div className="w-fit relative rounded-md overflow-hidden">
              {progresses.map((progress) => (
                <div
                  key={progress.objectInfo.key}
                  className="absolute inset-0 pointer-events-none"
                >
                  {progress.progress < 1 && progress.status !== "failed" && (
                    <Progress
                      className="h-full w-full rounded-md rounded-r-none bg-transparent"
                      indicatorClassName="bg-blue-500"
                      value={averageProgress * 100}
                    />
                  )}
                </div>
              ))}

              <Button
                className="bg-blue-500 px-8 py-4 hover:bg-blue-500/90 min-w-28 relative"
                onClick={open}
                disabled={isPending}
              >
                <span className="relative z-10">
                  {isPending ? (
                    <Ban className="font-bold text-white/80" />
                  ) : (
                    "Upload"
                  )}
                </span>
              </Button>
            </div>
          </div>

          <input
            {...getInputProps()}
            type="file"
            multiple
            id={_id || id}
            accept={accept}
            disabled={isPending}
          />
        </label>

        {isDragActive && (
          <div className="pointer-events-none absolute inset-0 rounded-lg">
            <div className="dark:bg-accent/40 bg-accent flex size-full flex-col items-center justify-center rounded-lg">
              <div className="my-2">
                <Upload className="size-6" />
              </div>

              <p className="mt-3 text-sm font-semibold">Drop files here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
