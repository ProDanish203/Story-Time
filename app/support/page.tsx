"use client";
import DashboardLayout from "../layouts/Dashboard";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paperclip, Search, SendHorizontal } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  closeTicket,
  getChatMessages,
  getChatsList,
  sendMessage,
} from "@/API/chats.api";
import { ChatTypes, ChatsListType, SupportChatOverview } from "@/types/types";
import { dateFormat } from "@/lib/dateFormat";
import { ChatListSkeleton } from "@/components/skeletons/ChatListSkeleton";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChatMessageSkeleton } from "@/components/skeletons/ChatMessageSkeleton";
import { toast } from "sonner";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import socketServcies from "@/lib/socket";
import { useAuth } from "@/store/AuthProvider";
import { Chat } from "@/types/chats";

interface Params {
  searchParams: {
    page: number;
    limit: number;
    chatId: string;
    userId: string;
    username: string;
  };
}

export default function Support({ searchParams }: Params) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { page, limit, chatId, userId, username } = searchParams;
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | undefined>();

  const router = useRouter();

  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("session") : null;

  useEffect(() => {
    // @ts-ignore
    socketServcies.initializeSocket(accessToken);
    const reqData = {
      userId: user?._id,
      chatSupport: true,
      page: 1,
    };
    socketServcies.emit("getChats", reqData);
    socketServcies.on(`getChats/${user?._id}`, (data: any) => {
      console.log(data);
    });

    return () => {
      socketServcies.disconnect();
    };
  }, [accessToken, user]);

  // Fetching all chats
  const { data, isLoading } = useQuery<ChatsListType>({
    queryKey: ["chats-list"],
    queryFn: () => getChatsList({ page, limit }),
  });

  // Fetching single chats
  const { data: chat, isLoading: isChatLoading } = useQuery<ChatTypes>({
    queryKey: ["chat", chatId],
    queryFn: () => getChatMessages({ page, limit, id: chatId }),
    enabled: !!chatId,
  });

  // Send message
  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!text) return toast.error("Field cannot be empty");
    if (!chatId) return toast.error("Please select a chat to send message");
    const formData = new FormData();
    formData.append("text", text);
    formData.append("chat", chatId);
    file && formData.append("media", file);

    const { success, response } = await mutateAsync(formData);
    if (!success) return toast.error(response);
    setText("");
    setFile(undefined);
  };

  // Close ticket
  const { mutateAsync: mutateCloseTicket, isPending: isClosing } = useMutation({
    mutationFn: closeTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", "chats-list"] });
    },
  });
  const handleCloseTicket = async () => {
    if (!chat || (chat && !chat.success) || !chat.response) return;
    if (isClosing) return;

    // const { success, response } = await mutateCloseTicket();
    // if (!success) return toast.error(response);
    router.push("/support");
  };

  console.log(chat?.response.supportMessages[0]);
  return (
    <DashboardLayout active={4}>
      <section className="px-10 mb-20">
        <h1 className="text-4xl text-primaryCol font-bold">Support</h1>

        <div className="border-2 border-borderCol mt-10 h-[800px] flex">
          <div className="max-w-xs w-full flex flex-col border-2 border-borderCol h-[800px] overflow-y-auto overflow-x-hidden">
            <div className="relative border-b-2 border-borderCol">
              <Input
                placeholder="Search here"
                className="px-16 mt-2 border-none placeholder:text-lg placeholder:opacity-30"
              />
              <Search className="size-5 text-primaryCol absolute top-5 left-7" />
            </div>
            {isLoading ? (
              <ChatListSkeleton />
            ) : (
              data &&
              data.success &&
              data.response &&
              data.response.supportChats.length > 0 &&
              data.response.supportChats.map((chat) => (
                <UserMessageList key={chat._id} chat={chat} />
              ))
            )}
          </div>

          <div className="border-2 border-b w-full">
            {chatId && chat && chat.success && chat.response && (
              <>
                <div className="p-5 flex gap-1 w-full border-b">
                  <Avatar>
                    <AvatarImage
                      src="/assets/dummy-user.webp"
                      alt="@shadcn"
                      sizes="30"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col pl-2">
                    <p className="font-bold text-md">{username}</p>
                    <p
                      className="text-sm cursor-pointer"
                      onClick={handleCloseTicket}
                    >
                      Mark as Completed
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-between w-full">
                  <div className="flex flex-col w-full">
                    <div className="flex-grow p-4 w-full border-gray-300 max-h-[650px] min-h-[650px] overflow-y-auto">
                      {/* Admin Messages on the left */}
                      <p className="flex justify-center text-xs mb-5">
                        8:00 AM
                      </p>
                      <div className="flex flex-col justify-start gap-y-1">
                        {isChatLoading ? (
                          <ChatMessageSkeleton />
                        ) : (
                          chat.response.supportMessages.length > 0 &&
                          chat.response.supportMessages
                            .reverse()
                            .map((msg) => (
                              <MessageBox
                                key={msg._id}
                                id={msg._id}
                                content={msg.text}
                                media={msg.media}
                                role={
                                  msg.user?._id === userId ? "user" : "admin"
                                }
                              />
                            ))
                        )}
                      </div>
                    </div>

                    {/* Admin Input Field at the bottom */}
                    <div className="w-full p-2">
                      <form
                        onSubmit={handleSendMessage}
                        className="flex items-center gap-2 relative"
                      >
                        <div className="flex items-center gap-2">
                          <label htmlFor="link">
                            <Paperclip className="cursor-pointer text-gray-500" />
                          </label>

                          <label htmlFor="picture">
                            <Image
                              src={"/assets/Picture.png"}
                              alt="Picture Icon"
                              width={30}
                              height={30}
                              className="cursor-pointer"
                            />
                          </label>
                          <input
                            type="file"
                            id="picture"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0])}
                          />
                        </div>

                        <Input
                          type="text"
                          id="link"
                          placeholder="Type a message..."
                          className="bg-backGroundColor rounded-md  flex-grow mr-2 border-none px-2"
                          value={text}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setText(e.target.value)
                          }
                        />
                        <Button
                          disabled={isPending}
                          type="submit"
                          className="size-14 bg-primaryCol hover:bg-primaryCol rounded-full"
                        >
                          <SendHorizontal className="size-10 text-white" />
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

const MessageBox = ({
  content,
  media,
  role,
  id,
}: {
  content: string;
  media: string[];
  role: string;
  id: string;
}) => {
  return (
    <div
      className={
        role === "user" ? "self-end max-w-[60%]" : "self-start max-w-[60%]"
      }
    >
      <p
        className={`${
          role === "user"
            ? "bg-primaryCol text-white"
            : "bg-gray-200 text-neutral-800"
        } p-4 text-sm rounded-xl`}
      >
        {content}
      </p>
      {media &&
        media.length > 0 &&
        media.map((img, idx) => (
          <Image
            key={`${id}-image-${idx}-${img}`}
            src="/assets/dummy-user.webp"
            alt="image"
            width={400}
            height={400}
            className="object-cover rounded-lg size-60 mt-1"
          />
        ))}
    </div>
  );
};

function UserMessageList({ chat }: { chat: SupportChatOverview }) {
  const router = useRouter();
  const pathname = usePathname();
  const openChat = () => {
    router.push(
      `${pathname}?chatId=${chat._id}&userId=${chat.user._id}&username=${
        chat.user.firstName + " " + chat.user.lastName
      }`
    );
  };

  return (
    <div
      onClick={openChat}
      className="relative p-5 bg-primaryCol bg-opacity-10 cursor-pointer"
    >
      <div className="flex gap-2 w-full">
        <Avatar>
          <AvatarImage src="/assets/dummy-user.webp" alt={chat.user.username} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col w-full">
          <p className="font-bold text-md">
            {chat.user.firstName} {chat.user.lastName}
          </p>
          <div className="flex items-end justify-between w-full">
            <p className="text-xs font-semibold">{chat.lastMessage.text}</p>
            <p className="text-xs mr-5">
              {dateFormat(chat.updatedAt || chat.createdAt)}
            </p>
          </div>
        </div>
        <div className="mt-6 pl-2"></div>
        {chat.status === "pending" && (
          <p className="absolute right-2 bg-primaryCol rounded-full text-xs w-6 pt-1 h-6 text-center text-white mt-4 ml-5">
            2
          </p>
        )}
      </div>
    </div>
  );
}
