"use client";
import { createGuideline, getGuideline } from "@/API/guideline.api";
import DashboardLayout from "@/app/layouts/Dashboard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Editor from "@/components/Editor";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GuidelinesData } from "@/types/types";
import { dateFormat } from "@/lib/dateFormat";
import { useRouter } from "next/navigation";

export default function FaqsSingle({ params }: { params: { id: string } }) {
  const { id } = params;
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");

  const router = useRouter();
  if (!id) router.push("/guideline/faqs");

  // Fetching content
  const { data, isLoading } = useQuery<GuidelinesData>({
    queryKey: ["faqs"],
    queryFn: () => getGuideline("FAQs"),
  });

  useEffect(() => {
    if (!isLoading && data && data.success) {
      const val = data?.response?.guidelines.filter((faq) => faq._id === id);
      setValue(val[0].content);
    }
  }, [data]);

  // Creating/updating content
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createGuideline,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faqs"] }),
  });

  const handleSubmit = async () => {
    if (!value) return toast.error("Content is required");
    const { success, response } = await mutateAsync({
      type: "FAQs",
      content: value,
      title: "FAQs",
      faqId: id,
    });
    if (!success) return toast.error(response);
    toast.success("Content updated");
  };

  return (
    <DashboardLayout active={5}>
      <div className="px-10 pb-10">
        <h1 className="text-5xl text-[#093732] font-bold">FAQs</h1>

        <div className="flex gap-20 my-14">
          <h4 className="opacity-80">
            <Link href={"/guideline"}>Terms & Condition</Link>
          </h4>
          <h4 className="font-bold  border-b-4 border-[#093732]">
            <Link href={"/guideline/faqs"}>FAQs</Link>
          </h4>
          <h4 className="opacity-80">
            <Link href={"/guideline/privacy"}>Privacy Policy</Link>
          </h4>
        </div>
        <div className="flex gap-4">
          <div className="w-3/4">
            <Editor value={value} setValue={setValue} />

            <div className="flex justify-center mt-5">
              <Button
                onClick={handleSubmit}
                className="bg-[#395E66] px-24 py-6 hover:bg-[#395e66b9]"
                disabled={isPending}
              >
                Save
              </Button>
            </div>
          </div>

          <div className="w-2/5 bg-white mx-2 p-10 mt-2 border-l-2 border-dashed border-[#E4E4E4] rounded-lg">
            <p className="font-bold text-3xl">All FAQs</p>
            <div className="pt-4"></div>
            <div className="flex flex-col space-y-2 p-3">
              {data?.response.guidelines.map((faq) => (
                <div key={faq._id}>
                  <p className="text-sm font-semibold ">
                    {dateFormat(faq.updatedAt || faq.createdAt)} ago
                  </p>
                  <Link
                    href={`/guideline/faqs/${faq._id}`}
                    className="text-md underline cursor-pointer line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: faq.content }}
                  ></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
