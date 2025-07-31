import { ContainerTextFlip } from "@/components/ui/container-text-flip";

export default function FeatureText() {
  return (
                      <div className="text-gray-600 text-base md:text-lg leading-relaxed">
                We&apos;ve started our journey with huge competition, a lack of
                resources, and a lot of challenges. But we&apos;ve been able to
                make it 
                    {<TextFlip words={["better", "great", "fun", "easy"]} />}                
                
                 for you, providing the things that we wished had
                existed before. Walking with you from the beginning to the end.
                from your entrance exam to your successful graduation, and maybe
                more. That&apos;s the plan we have with you.
              </div>
      
  )
}



 
 function TextFlip({words}: {words: string[]}) {
  return (
    <ContainerTextFlip
    className="text-base p-1 mx-2"
      words={words}
    />
  );
}