"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";
import { Label } from "./ui/label";
import { Pencil, X } from "lucide-react";
import { convertImage } from "@/lib/convertImage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/API/categories.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddingCategories({
  text,
  id,
}: {
  text: string;
  id?: string;
}) {
  const queryClient = useQueryClient();

  const [image, setImage] = useState<string>("");
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);

  const router = useRouter();

  const handleFileChange = async (file: any) => {
    try {
      setFile(file);
      const base64Image = await convertImage(file);
      setImage(base64Image);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleImageDelete = () => {
    setFile(undefined);
    setImage("");
  };

  // Creating category
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      const queryKey = id ? ["sub-categories"] : ["categories"];
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });

  // Create handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title) return toast.error("Category name is required");
    if (!file) return toast.error("Picture is required");
    if (!color) return toast.error("Color is required");

    const formData = new FormData();
    formData.append("name", title);
    formData.append("image", file);
    formData.append("hexCode", color);
    id && formData.append("parent", id);

    const { success, response } = await mutateAsync(formData);
    if (!success) return toast.error(response);
    toast.success("Category added");
    router.push("/categories");
  };

  return (
    <div className="mx-10 h-full">
      <section className="flex justify-between mt-7 h-10  items-center">
        <h1 className="text-4xl font-bold text-[#093732]">{text}</h1>
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className={"bg-primaryCol hover:bg-[#395e66d7] px-7 py-6"}
        >
          Save
        </Button>
      </section>
      <div className="flex w-full h-full">
        <div className="bg-[#F3F3F3] flex-grow h-full p-4 mt-10 rounded-md">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="Title">Title</Label>
            <Input
              type="email"
              id="Title"
              placeholder="Title"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
            <Label htmlFor="hexColor">Color</Label>
            <Input
              type="color"
              id="hexColor"
              placeholder="Placeholder"
              value={color}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setColor(e.target.value)
              }
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5 mt-5">
            <Label htmlFor="IMAGE">IMAGE</Label>
            <div
              className={`relative w-full h-[178px] rounded-lg  border-[3px] border-spacing-32`}
            >
              <label
                htmlFor="fileInput"
                className="absolute inset-0 cursor-pointer"
              >
                <div className="flex-col flex items-center justify-center h-full  bg-white">
                  <Image
                    className="text-gray-500"
                    src="/assets/upload.png"
                    width={50}
                    height={50}
                    alt="upload-icon"
                  />
                  <p className="text-[#AAAAAA] text-sm text-center mt-1">
                    Click to select an asset or drag and drop in <br /> this
                    area
                  </p>
                </div>
              </label>
              <Input
                id="fileInput"
                type="file"
                className="hidden"
                accept="image/jpeg, image/png"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />
              {image && (
                <div className="relative w-full h-full cursor-pointer">
                  <div
                    className="bg-red-500 rounded-full p-2 absolute bottom-[89%] left-[95%] cursor-pointer z-20"
                    onClick={handleImageDelete}
                  >
                    <X />
                  </div>
                  <Image
                    fill
                    src={image}
                    alt="Preview"
                    className="object-cover object-center"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-start ml-5">
          <Button
            variant={"outline"}
            className="border-[#AAAAAA] py-7 flex gap-2 items-center"
          >
            <Pencil
              className="text-primaryCol"
              fill="#395E66"
              stroke="#fff"
              strokeWidth={1}
            />
            Editing Draft Version
          </Button>
          <Button
            className="mt-3 border-[#AAAAAA] text-red-600 flex gap-1 items-center"
            variant={"outline"}
          >
            <Image src={"/assets/icon.png"} alt="" width={18} height={10} />{" "}
            Delete this entry
          </Button>
        </div>
      </div>
    </div>
  );
}
