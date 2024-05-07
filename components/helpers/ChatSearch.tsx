import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks";

export const ChatSearch = () => {
  const [value, setValue] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = useDebounce(value, 700);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const currentQuery = searchParams.get("search") || "";

    // Reset page to 1 only when the search query changes
    if (query !== currentQuery) {
      router.push(`${pathname}?${createQueryString("search", query)}`);
    }
  }, [query, router, pathname, searchParams, createQueryString]);

  return (
    <div className="relative border-b-2 border-borderCol">
      <Input
        placeholder="Search here"
        className="px-16 mt-2 border-none placeholder:text-lg placeholder:opacity-30 focus-visible:ring-0 focus-visible:ring-offset-0"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
      />
      <Search className="size-5 text-primaryCol absolute top-5 left-7" />
    </div>
  );
};
