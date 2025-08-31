import Image from "next/image";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  // detect how many <img> tags exist in the markdown
  const imageCount = useMemo(() => {
    const matches = value.match(/<img\s+[^>]*src=|!\[.*?\]\(.*?\)/g);
    return matches ? matches.length : 0;
  }, [value]);

  return (
    <div className="bg-white p-6 rounded max-w-[90%] md:max-w-[800px] mx-auto prose prose-slate">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({ node, ...props }) => {
            const src = typeof props.src === "string" ? props.src : "";
            const alt = props.alt || "";

            const width = props.width ? Number(props.width) : 340;
            const height = props.height ? Number(props.height) : 300;

            return (
              <div
                className={`my-6 w-full flex ${
                  imageCount === 1 ? "justify-center" : "justify-start"
                }`}
              >
                <div className="relative w-[320px] h-[300px] overflow-hidden rounded-lg">
                  <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "12px",
                    }}
                    className="object-cover object-center"
                  />
                </div>
              </div>
            );
          },
          p: ({ node, children }) => (
            <p className="mb-4 leading-7 text-gray-800">{children}</p>
          ),
          h1: ({ node, children }) => (
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              {children}
            </h1>
          ),
          h2: ({ node, children }) => (
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-3">
              {children}
            </h2>
          ),
          h3: ({ node, children }) => (
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2">
              {children}
            </h3>
          ),
          h4: ({ node, children }) => (
            <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-2">
              {children}
            </h4>
          ),
          h5: ({ node, children }) => (
            <h5 className="text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-1">
              {children}
            </h5>
          ),
          h6: ({ node, children }) => (
            <h6 className="text-xs sm:text-sm md:text-base lg:text-lg font-medium mb-1">
              {children}
            </h6>
          ),
        }}
      >
        {value}
      </ReactMarkdown>
    </div>
  );
};
