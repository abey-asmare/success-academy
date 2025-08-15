import useFancybox from "@/hooks/useFancyBox"
import { cn } from "@/lib/utils"

export default function FancyBoxWrapper({children, className}: {children: React.ReactNode, className?: string}){
    const [fancyBoxRef] = useFancybox()
    return (
        <div ref={fancyBoxRef} className={cn("", className)}>
            {children}
        </div>
    )
}