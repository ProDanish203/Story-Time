import api from "./middleware";

export const sendMessage = async (formData: FormData) => {
  try {
    console.log(formData);
    const response = await api.post("/support/send-message", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      response: response,
    };
  } catch (error: any) {
    return {
      success: false,
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const getChatsList = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  try {
    const { data } = await api.get(
      `/support/chat-list?page=${page || 1}&limit=${limit || 1000}`
    );
    return {
      success: true,
      response: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const getChatMessages = async ({
  page,
  limit,
  id,
}: {
  page: number;
  limit: number;
  id: string;
}) => {
  try {
    const { data } = await api.get(
      `/support/${id}?page=${page || 1}&limit=${limit || 30}`
    );
    return {
      success: true,
      response: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const closeTicket = async (id: string) => {
  try {
    const { data } = await api.put(`/support/close-ticket`, {
      chat: id,
    });
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

export const sendMedia = async (media: any) => {
  let formData = new FormData();
  formData.append("media", media);
  return api.post("/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
