'use client'

export default function UnDownloadableImage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative aspect-video mt-2 w-full max-w-4xl pointer-events-none select-none" onContextMenu={(e) => e.preventDefault()}>
      {children}
    </div>
  );
}
