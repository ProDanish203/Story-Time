"use client";
import DashboardLayout from "../layouts/Dashboard";
import Editor from "@/components/Editor";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createGuideline, getGuideline } from "@/API/guideline.api";
import { GuidelinesData } from "@/types/types";

export default function GuidelinePage() {
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");

  // Fetching content
  const { data, isLoading } = useQuery<GuidelinesData>({
    queryKey: ["terms"],
    queryFn: () => getGuideline("TermsAndConditions"),
  });

  useEffect(() => {
    if (!isLoading && data && data.success) {
      setValue(data?.response?.guidelines[0].content);
    }
  }, [data]);

  // Creating/updating content
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createGuideline,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["terms"] }),
  });

  const handleSubmit = async () => {
    if (!value) return toast.error("Content is required");
    const { success, response } = await mutateAsync({
      type: "TermsAndConditions",
      content: value,
      title: "Terms And Conditions",
    });
    if (!success) return toast.error(response);
    toast.success("Content updated");
  };
  console.log(data?.response)
  return (
    <DashboardLayout active={5}>
      <div className="px-10 pb-10">
        <h1 className="text-5xl text-[#093732] font-bold">
          Terms And Conditions
        </h1>

        <div className="flex gap-20 my-14">
          <h4 className="font-bold  border-b-4 border-[#093732]">
            Terms & Condition
          </h4>
          <h4 className="opacity-80">
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
              >
                Save
              </Button>
            </div>
          </div>

          {/* <div className="w-2/5   bg-white mx-2 p-10 mt-2 border-l-2 border-dashed border-[#E4E4E4] rounded-lg">
            <p className="mb-5  font-bold text-3xl">Update Logs</p>
            <p className="text-md">April 23, 2023</p>
            <div className="p-4 "></div>
            <div className="flex flex-col space-y-2  p-3">
              <p className="text-md font-semibold ">10/19/2022</p>
              <p className="text-sm ">Notification was sent</p>
              <p className="text-md font-semibold">10/19/2022</p>
              <p className="text-sm ">Notification was sent</p>
            </div>
          </div> */}
        </div>
      </div>
    </DashboardLayout>
  );
}
