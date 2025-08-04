'use client';

import { Button } from "@/components/ui/button";
import { deleteSimulation } from "./actions";
import { useActionState } from "react";

interface DeleteFormColumnProps {
  examId: string;
}

export function DeleteFormColumn({ examId }: DeleteFormColumnProps) {
  const deleteSimulationHandler = deleteSimulation.bind(null, examId)
  const [state, formAction, pending] = useActionState(deleteSimulationHandler, null);  
  return (
    <form action={formAction}>
      <Button
        type="submit"
        size="sm"
        className="text-red-500 hover:text-red-600 bg-transparent hover:bg-transparent w-full h-full"
        variant="link"
        disabled={pending}
      >
        {pending ? "Deleting..." : "Delete Exam"}
      </Button>
    </form>
  );
}
