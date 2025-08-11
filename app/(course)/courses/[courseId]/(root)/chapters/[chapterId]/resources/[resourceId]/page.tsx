import UnDownloadableImage from "@/components/UnDownloadableImage";
import { db } from "@/lib/db";
import Image from "next/image";
import { TextPreview } from "../../components/TextPreview";

function getResourceCategory(
  mimeType: string
): "image" | "pdf" | "video" | "audio" | "text" | "unknown" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (
    mimeType.startsWith("text/") ||
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "text";

  return "unknown";
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ resourceId: string; chapterId: string; courseId: string }>;
}) {
  const { resourceId, courseId } = await params;
  const resource = await db.attachment.findUnique({
    where: {
      id: resourceId,
      courseId: courseId,
    },
  });

  const mimeType = resource?.type || "";
  const resourceCategory = getResourceCategory(mimeType);

  return (
    <div>
      <div className="border p-4 rounded shadow-sm space-y-4">
        {resourceCategory === "image" && resource?.url && (
          <UnDownloadableImage className="w-[300px] h-[400px]">
            <Image
            className="w-full h-full rounded object-contain"
              src={resource.url}
              alt={resource.name || "Image"}
              width={800}
              height={600}
            />
          </UnDownloadableImage>
        )}

        {resourceCategory === "pdf" && resource?.url && (
          <iframe
            src={resource.url}
            title={resource.name}
            className="w-full h-[600px] rounded border"
            sandbox="allow-same-origin allow-scripts"
            referrerPolicy="no-referrer"
          />
        )}

        {resourceCategory === "video" && resource?.url && (
          <video
            controls
            src={resource.url}
            className="w-full h-[500px] max-w-3xl rounded"
          />
        )}

        {resourceCategory === "audio" && resource?.url && (
          <audio controls src={resource.url} className="w-full" />
        )}

        {resourceCategory === "text" && resource?.url && (
          <TextPreview url={resource.url} />
        )}

        {resourceCategory === "unknown" && (
          <div className="text-sm text-gray-500">Unsupported file type</div>
        )}
      </div>
    </div>
  );
}
