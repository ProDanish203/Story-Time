"use client";
import { deleteCategory } from "@/API/categories.api";
import { Button } from "./ui/button";
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
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

export default function DeleteCategories({
  id,
  setOpen,
  open,
}: {
  id: string;
  setOpen: any;
  open: boolean;
}) {
  const queryClient = useQueryClient();

  // Delete category
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories", "sub-categories"],
      });
    },
  });

  // Delete handler
  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return toast.error("Category Id is required");

    const { success, response } = await mutateAsync(id);
    if (!success) return toast.error(response);
    else toast.success("Category deleted");
    setOpenSuccess(true);
  };

  const [openSuccess, setOpenSuccess] = useState(false);
  const ButtonRef = useRef<HTMLButtonElement>(null);

  const CloseDialog = () => {
    ButtonRef.current?.click();
    setOpenSuccess(false);
    setOpen(false);
  };

  return (
    <div className="relative bg-white shadow-2xl">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="absolute top-0  right-0 bg-white text-black hover:bg-white shadow-xl  items-center p-3 flex gap-3 z-40">
            <Trash className="bg-red-500 px-1 rounded-lg size-7 text-white" />
            Delete Design
          </Button>
        </AlertDialogTrigger>
        {!openSuccess ? (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogDescription className="flex flex-col  gap-3 items-center mt-5 justify-center">
                <span className="text-2xl text-[#093732] font-semibold">
                  Delete Category
                </span>
                <span className="text-center mt-3 font-medium text-lg opacity-70 text-black">
                  Are you sure you want to permanently delete this Category?
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild onClick={handleDelete}>
                    <Button className="rounded-lg bg-[#395E66] hover:bg-[#395e66ce]  px-24 py-7 text-lg">
                      Confirm
                    </Button>
                  </AlertDialogTrigger>
                </AlertDialog>
                <AlertDialogCancel className="text-black border-none">
                  Cancel
                </AlertDialogCancel>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        ) : (
          <AlertDialogContent className="h-[18%] w-[20%]  ">
            <AlertDialogHeader>
              <AlertDialogDescription className="flex flex-col  gap-3 items-center mt-5 justify-center">
                <h1 className="text-2xl text-[#093732] font-bold">
                  Successfully Deleted
                </h1>

                <AlertDialogCancel>
                  <Button
                    className=" rounded-2xl bg-[#395E66] hover:bg-[#395e66ce]  px-24 py-7 text-lg"
                    onClick={CloseDialog}
                  >
                    Back
                  </Button>
                </AlertDialogCancel>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </div>
  );
}