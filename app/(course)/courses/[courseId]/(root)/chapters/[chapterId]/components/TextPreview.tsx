'use client'
import { useState, useEffect } from "react";

export const TextPreview = ({ url }: { url: string }) => {
    const [content, setContent] = useState<string>("Loading...");
  
    useEffect(() => {
      fetch(url)
        .then((res) => res.text())
        .then(setContent)
        .catch(() => setContent("Failed to load file"));
    }, [url]);
  
    return (
      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 whitespace-pre-wrap text-sm">
        {content}
      </pre>
    );
  };
  