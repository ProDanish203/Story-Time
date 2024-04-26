"use client";
import React from "react";
import DashboardLayout from "../layouts/Dashboard";
import CategoryLayout from "../layouts/CategoryLayout";
import { Card } from "@/components/Card";
import { getCategories } from "@/API/categories.api";
import { useQuery } from "@tanstack/react-query";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { CategoryData } from "@/types/types";
import Pagination from "@/components/helpers/Pagination";

interface Params {
  searchParams: {
    page: number;
    limit: number;
    search: string;
  };
}

export default function Category({ searchParams }: Params) {
  const { page, limit, search } = searchParams;

  const { data, isLoading } = useQuery<CategoryData>({
    queryKey: ["categories", page, limit, search],
    queryFn: () => getCategories({ page, limit, search }),
  }); 

  return (
    <DashboardLayout active={2}>
      <div>
        <CategoryLayout title="Category" buttonText="Add a Category" isCategory>
          {isLoading ? (
            <CardSkeleton />
          ) : (
            data &&
            data.success &&
            data.response &&
            data.response.categories.length > 0 &&
            data.response.categories.map((cat) => (
              <Card
                key={cat._id}
                status={cat.createdAt}
                title={cat.name}
                image={cat.image}
                navigation
                id={cat._id}
              />
            ))
          )}
        </CategoryLayout>
        {data && data.success && data.response && data.response.pagination && (
          <Pagination data={data.response.pagination} />
        )}
        {!data ||
          (!data.response && (
            <h2 className="text-black text-4xl font-bold ml-10">No results</h2>
          ))}
      </div>
    </DashboardLayout>
  );
}
