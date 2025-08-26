"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@react-hook/media-query";
import DatePickerForm from "./DatePicker-form";
import { useFormStatus } from "react-dom";
import { addPromocode } from "../actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export function PromocodeForm({
  courseId,
  coursePrice,
}: {
  courseId: string;
  coursePrice: number;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-fit">
            Add Promocode
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Promocode</DialogTitle>
            <DialogDescription>
              Make changes. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <PromoContentForm courseId={courseId} coursePrice={coursePrice} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-fit">
          Add Promocode
        </Button>
      </DrawerTrigger>
      <DrawerContent>
      <ScrollArea className="p-4 max-h-[60vh] overflow-auto">

        <DrawerHeader className="text-left">
          <DrawerTitle>Add Promocode</DrawerTitle>
          <DrawerDescription>
            Make changes. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <PromoContentForm
          className="px-4"
          courseId={courseId}
          coursePrice={coursePrice}
          setOpen={setOpen}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

function PromoContentForm({
  className,
  courseId,
  coursePrice,
  setOpen   ,
}: React.ComponentProps<"form"> & { courseId: string; coursePrice: number; setOpen: (open: boolean) => void }) {
  const [codeState, setCodeState] = React.useState({
    code: "",
    discount: 0,
    appliedFrom: new Date() || undefined,
    expiredAt: new Date() || undefined,
  });
  const discountedPrice =
    coursePrice - (coursePrice * codeState.discount) / 100;

    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
          
         toast.promise(
            addPromocode(courseId, formData),
            {
                loading: "Adding promocode...",
                success: "Promocode added successfully",
                error: "Failed to add promocode"
            }
        )
        router.refresh()
        setOpen(false)
    }
  return (
    <form
      className={cn("grid items-start gap-6", className)}
     action={handleSubmit}
    >
      <div className="grid gap-3">
        <Label htmlFor="code">Code</Label>
        <Input
          name="code"
          type="text"
          id="code"
          className="uppercase"
          placeholder="ABC1234"
          value={codeState.code}
          onChange={(e) => setCodeState({ ...codeState, code: e.target.value })}
          minLength={6}
          maxLength={6}
          required
        />
        <p>new price will be {discountedPrice}</p>
        <Label htmlFor="discount">Discount in percent</Label>
        <Input
          name="discount"
          type="number"
          id="discount"
          placeholder="20"
          value={codeState.discount ? codeState.discount : ""}
          onChange={(e) =>
            setCodeState({ ...codeState, discount: Number(e.target.value) })
          }
          min={1}
          max={100}
          required
        />
        <DatePickerForm
          name="appliedFrom"
          label="Promocode applied from"
          description="The promocode will be applied from "
          value={codeState.appliedFrom || undefined}
          onChange={(date: Date) =>
            setCodeState({ ...codeState, appliedFrom: date })
          }
        />
        <DatePickerForm
          name="expiredAt"
          label="Promocode expired at"
          description="The promocode will be expired just after "
          value={codeState.expiredAt || undefined}
          onChange={(date: Date) =>
            setCodeState({ ...codeState, expiredAt: date })
          }
        />
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save changes'}
    </Button>
  );
}
