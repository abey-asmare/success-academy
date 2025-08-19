'use client'
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function SubmitButton({
    onClick,
    isLoading,
}: {
    onClick: () => void;
    isLoading: boolean;
}) {


return <Button type="button" 
onClick={()=> onClick()}
disabled={isLoading} aria-disabled={isLoading} className="bg-sky-600 hover:bg-sky-700">
    <p id="loading" className="sr-only">Adding Category please wait...</p>
    <div className="flex items-center gap-x-1">
  <Loader2
    className={cn(
      "h-4 w-4 animate-spin opacity-0 transition-opacity duration-500",
      isLoading && "opacity-100"
    )}
    aria-describedby="loading"
  />
  Add Category
</div>

  </Button>
}       