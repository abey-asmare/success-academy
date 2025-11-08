'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function AnswerDescription({description}: {description?: string | null}) {

const [desc, setDesc] = useState<string>()
//  simulate api call with more than 1 second
    const getDescription = (): Promise<string> => {
        return new Promise(resolve =>{
           setTimeout(() => {
            resolve(description || "Description not available")
           }, Math.random() * 1000 + 1000)
        })
    }

  return (
    <Accordion
      type="single"
      collapsible   
      className=" rounded-md px-4"

    >
      <AccordionItem value="item-1">
        <AccordionTrigger onClick={async ()=> setDesc(await getDescription())}>Description</AccordionTrigger>
        <AccordionContent className={cn("space-y-2 px-4", desc ? "text-gray-600" : "")}>
         {desc ? desc : <>
         <Skeleton className="h-4" />
         <Skeleton className="h-4" />
         <Skeleton className="h-4 w-3/4" />
         </>}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
