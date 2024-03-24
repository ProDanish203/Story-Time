import { headers } from "next/headers";
import api from "./middleware";

export const loginMutate = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { data } = await api.post(
      "/auth/login",
      {
        email,
        password,
        fcmToken: "fcmtoken12121212",
      }
      // {
      //  withCredentials: true
      // }
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

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/getCurrentUser");

    return {
      success: true,
      response: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const forgetPass = async (email: string) => {
  try {
    const { data } = await api.put("/auth/forget-password", { email });

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

export const verifyResetToken = async (resetToken: string) => {
  try {
    const { data } = await api.put("/auth/verify-reset-token", { resetToken });

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

export const resetPass = async ({
  newPassword,
  confirmPassword,
}: {
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const { data } = await api.put("/auth/reset-password", {
      newPassword,
      confirmPassword,
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
