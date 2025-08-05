'use client'

type UnDownloadableImageProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export default function UnDownloadableImage({
  children,
  ...props
}: UnDownloadableImageProps) {
  return (
    <div 
    {...props}
    className={`relative mt-2 w-full max-w-4xl pointer-events-none select-none w-full h-[600px] m-auto`}  
    onContextMenu={(e) => e.preventDefault()} >
    {children}
    </div>
  );
}
