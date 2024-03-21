import api from "./middleware";

export const getCategories = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}) => {
  try {
    const { data } = await api.get(
      `/category?limit=${limit || 15}&page=${page || 1}&search=${search || ""}`
    );
    return {
      success: true,
      response: data,
    };
  } catch (error: any) {
    return {
      success: false,
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const getSubCategories = async ({
  page,
  limit,
  search,
  id,
}: {
  page: number;
  limit: number;
  search: string;
  id: string;
}) => {
  try {
    const { data } = await api.get(
      `/category?parent=${id}&limit=${limit || 15}&page=${page || 1}&search=${
        search || ""
      }`
    );
    return {
      success: true,
      response: data,
    };
  } catch (error: any) {
    return {
      success: false,
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};