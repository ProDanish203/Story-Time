"use client";
import React, { useState } from "react";
import DashboardLayout from "../layouts/Dashboard";
import PushInfomation from "@/components/PushInfomation";
import { Button } from "@/components/ui/button";
import Editor from "@/components/Editor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getNotifications, pushNotification } from "@/API/notiifications";
import { dateFormatMM } from "@/lib/dateFormat";
import { NotificationType } from "@/types/types";

export default function NotificationPage() {
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  const [date, setDate] = useState<Date | undefined>();

  // Fetching all notifications
  const { data, isLoading } = useQuery<NotificationType>({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
  });

  // Pushing Notification
  const { mutateAsync, isPending } = useMutation({
    mutationFn: pushNotification,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const handleSubmit = async () => {
    if (!value) return toast.error("Content is required");
    if (!title) return toast.error("Title is required");
    const { success, response } = await mutateAsync({
      title,
      message: value,
      sendToAll,
    });
    if (!success) return toast.error(response);
    toast.success("Notification sent");
    setTitle("");
    setValue("");
    setDate(undefined);
  };

  return (
    <DashboardLayout active={3}>
      <div className="p-7 flex justify-between ">
        <h1 className="text-4xl  text-primaryCol font-bold">
          Push Notification
        </h1>
      </div>
      <div className="flex border-[#E4E4E4] rounded-lg border-2 m-5 mt-0">
        <div className="mt-2 w-full ml-2 rounded-lg flex-col border-[#E4E4E4] border">
          <div className="bg-white  pb-6 rounded-md ">
            <PushInfomation
              date={date}
              sendToAll={sendToAll}
              setDate={setDate}
              setSendToAll={setSendToAll}
              setTitle={setTitle}
              title={title}
            />
          </div>

          <div className="p-5 bg-white">
            <div className="min-h-[530px]  border-2 border-[#E4E4E4]">
              <Editor value={value} setValue={setValue} />
            </div>
          </div>

          <div className="flex justify-center mt-5">
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-primaryCol  px-20 hover:bg-[#395e66b9]"
            >
              Push Now
            </Button>
          </div>
        </div>

        <div className="w-2/6 h-screen  bg-white mx-2 p-10 mt-2 border-2 border-[#E4E4E4] rounded-lg">
          <p className="mb-5 text-lg font-semibold">History</p>
          <div className="flex flex-col space-y-4 border-l-2 border-dashed p-3">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              data &&
              data.success &&
              data.response &&
              data.response.notifications.length > 0 &&
              data.response.notifications.map((notif) => (
                <div key={notif._id} className="flex items-center gap-4 px-3">
                  <p className="text-xs text-[#bebebe]">
                    {dateFormatMM(notif.createdAt)}
                  </p>
                  <p className="text-sm text-[#979797] truncate">
                    {notif.title}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
