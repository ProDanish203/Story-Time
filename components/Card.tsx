"use client";
import Image from "next/image";
import { FC, useState } from "react";
import DeleteCategories from "./DeleteCategories";
import { useRouter } from "next/navigation";

interface card {
  image: string;
  title: string;
  status: string;
  navigation: boolean;
  id: string;
}
export const Card: FC<card> = ({ image, status, title, navigation, id }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const navigate = () => {
    navigation && router.push(`/categories/${id}?name=${title}`);
  };

  return (
    <div className="w-64 border-2 border-[#DBDBDB] h-[270px] p-3 rounded-2xl flex flex-col justify-between">
      <div className="flex justify-end">
        <Image
          src={`/assets/More.png`}
          alt="3 Dot"
          width={6}
          height={5}
          className="cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      </div>
      {open ? <DeleteCategories id={id} setOpen={setOpen} open={open}/> : null}
      <div className="flex flex-col justify-between items-center">
        <div className={navigation ? "cursor-pointer" : ""} onClick={navigate}>
          <Image
            alt={title}
            src={"/assets/work.png"}
            width={152}
            height={132}
          />
        </div>
        <div className="text-center mt-4">
          <p className="font-bold text-black text-lg">{title}</p>
          <p className="text-black opacity-35 text-sm">{status}</p>
        </div>
      </div>
    </div>
  );
};
