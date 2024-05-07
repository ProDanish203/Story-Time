"use client";
import { ChangeEvent } from "react";
import { DatePicker } from "./DatePicker";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Props {
  title: string;
  setTitle: (title: string) => void;
  date: Date | undefined;
  setDate: any;
  sendToAll: boolean;
  setSendToAll: (send: boolean) => void;
}

export default function PushInfomation({
  date,
  setDate,
  sendToAll,
  setSendToAll,
  setTitle,
  title,
}: Props) {
  return (
    <>
      <div>
        <div className="p-7">
          <div className="flex items-center justify-between space-x-10 ">
            <div className="flex gap-10">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="all-users"
                  checked={sendToAll}
                  onChange={() => setSendToAll(true)}
                />
                <Label htmlFor="all-users" className="text-md">
                  All users
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="all-active-users"
                  checked={!sendToAll}
                  onChange={() => setSendToAll(false)}
                />
                <Label htmlFor="all-active-users" className="text-md">
                  All Active users
                </Label>
              </div>
            </div>

            <DatePicker date={date} setDate={setDate} />
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className="relative mt-3 px-6 ">
          <p className="absolute  text-xm text-PrimaryColor px-3 mt-2">Title</p>
          <div className="flex">
            <Input
              type="text"
              placeholder="Title here"
              className="h-16 rounded-lg bg-InputFieldColor pt-7 text-gray-500"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
