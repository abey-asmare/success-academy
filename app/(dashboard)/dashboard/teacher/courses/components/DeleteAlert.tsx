import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const data = {
  title: "Are you sure you want to delete this chapter?",
  description:
    "This action cannot be undone. This will permanently delete this resource, you will not be able to recover it.",
  dialogCancelTitle: "Cancel",
  dialogContinueTitle: "Continue",
}

export default function DeleteAlert({
  children,
  title = data.title,
  description = data.description,
  dialogCancelTitle = data.dialogCancelTitle,
  dialogContinueTitle = data.dialogContinueTitle,
  onContinue,
}: {
  children: React.ReactNode
  onContinue: () => void
  title?: string
  description?: string
  dialogCancelTitle?: string
  dialogContinueTitle?: string
}) {

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {dialogCancelTitle}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onContinue}>
            {dialogContinueTitle}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
