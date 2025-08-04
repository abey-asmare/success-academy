import { Button } from "@/components/ui/button";
import { deleteSimulation } from "./actions";
import { useActionState } from "react";


export default function DeleteFormColumn({ id }: { id: string }) {
    const deleteSimulation_ = deleteSimulation.bind(null, id)
    const [state, formAction, pending] = useActionState(deleteSimulation_, null);
  return (
    <form
      action={ formAction}
       className="flex justify-center items-center flex-1" 
        >
        <Button
            variant="link"
            size="sm"
            className="text-red-600 hover:text-red-700 bg-transparent w-full h-full p-2 flex-1"
            type="submit" ad
            disabled={pending}
        >
            {pending ? "Deleting..." : "Delete"}
        </Button>
        </form>
  );
}
