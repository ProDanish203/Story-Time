"use client";
import DashboardLayout from "../../layouts/Dashboard";
import Link from "next/link";
import Editor from "@/components/Editor";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGuideline, getGuideline } from "@/API/guideline.api";
import { toast } from "sonner";
import { GuidelinesData } from "@/types/types";
import { LogCard } from "../page";
import { dateFormatMM } from "@/lib/dateFormat";

export default function PrivacyPolicy() {
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");

  // Fetching content
  const { data, isLoading } = useQuery<GuidelinesData>({
    queryKey: ["privacy-poilcy"],
    queryFn: () => getGuideline("PrivacyPolicy"),
  });

  useEffect(() => {
    if (!isLoading && data && data.success) {
      setValue(data?.response?.guidelines[0].content);
    }
  }, [data]);

  // Creating/updating content
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createGuideline,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["privacy-poilcy"] }),
  });

  const handleSubmit = async () => {
    if (!value) return toast.error("Content is required");
    const { success, response } = await mutateAsync({
      type: "PrivacyPolicy",
      content: value,
      title: "Privacy Policy",
    });
    if (!success) return toast.error(response);
    toast.success("Content updated");
  };

  return (
    <DashboardLayout active={5}>
      <div className="px-10 pb-10">
        <h1 className="text-5xl text-[#093732] font-bold">Privacy Policy</h1>

        <div className="flex gap-20 my-14">
          <h4 className="opacity-80">
            <Link href={"/guideline"}>Terms & Condition</Link>
          </h4>
          <h4 className="opacity-80">
            <Link href={"/guideline/faqs"}>FAQs</Link>
          </h4>
          <h4 className="font-bold  border-b-4 border-[#093732]">
            Privacy Policy
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

          <div className="w-2/5  bg-white mx-2 p-10 mt-2 border-l-2 border-dashed border-[#E4E4E4] rounded-lg">
            <p className="mb-5  font-bold text-3xl">Update Logs</p>
            <p className="text-md">April 23, 2023</p>
            <div className="p-4"></div>
            {data && data.success && data.response && (
              <>
                <LogCard
                  title="Policy created"
                  date={dateFormatMM(data.response.guidelines[0].createdAt)}
                />
                {data.response.guidelines[0].updatedAt && (
                  <LogCard
                    title="Policy updated"
                    date={dateFormatMM(data.response.guidelines[0].updatedAt)}
                    hideBar
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
