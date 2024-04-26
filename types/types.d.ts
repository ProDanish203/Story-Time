import z from "zod";

export interface AuthModule {
  title: string;
  subText: string;
  children: React.ReactNode;
  additionalText?: string;
}

interface SiginFields {
  email: string;
  password: string;
}

export type SigninFields = z.infer<typeof SignInSchema>;

interface ForgetFields {
  email: string;
}

export type ForgetFields = z.infer<typeof ForgetSchema>;

interface ResetPassword {
  password: string;
  confirmPassword: string;
}

export type ResetPassword = z.infer<typeof ResetPasswordSchema>;

export interface CategoryType {
  _id: string;
  image: string;
  name: string;
  parent: string | null;
  updatedAt?: string;
  createdAt: string;
}

export interface CategoryData {
  success: boolean;
  response: {
    categories: CategoryType[];
    pagination: PaginationTypes;
  };
}

export interface DashboardUser {
  _id: string;
  card: string | null;
  city: string;
  completePhone: string;
  countryCode: string;
  createdAt: string;
  decryptedPassword: string;
  email: string;
  fcmToken: string;
  firstName: string;
  isActive: boolean;
  isDeleted: boolean;
  isPublic: boolean;
  lastName: string;
  noOfFollowers: number;
  noOfFollowings: number;
  phoneCode: string;
  phoneNo: string;
  role: string;
  settings: {
    systemNotification: boolean;
    inAppNotifications: boolean;
    appVibrations: boolean;
  };
  state: string;
  textStoriesCount: number;
  updatedAt?: string;
  username: string;
  videoStoriesCount: number;
  zipCode: string;
}

export interface DashboardTypes {
  success: boolean;
  response: {
    users: DashboardUser[];
    pagination: PaginationTypes;
  };
}

export interface ChatListType {
  _id: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: {
    text: string;
  };
  status: string;
  user: {
    firstName: string;
    lastName: string;
    _id: string;
    username: string;
  };
}

export interface ChatMessage {
  createdAt: string;
  updatedAt: string;
  chat: string;
  _id: string;
  text: string;
  user: {
    firstName: string;
    lastName: string;
    _id: string;
    username: string;
  };
  media: string[];
}

export interface PaginationTypes {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: null | number;
  perPage: number;
  prevPage: null | number;
  totalItems: number;
  totalPages: number;
}

export interface GuidelinesData {
  success: boolean;
  response: {
    guidelines: {
      _id: string;
      type: string;
      content: string;
      title: string;
      createdAt: string;
      updatedAt?: string;
      id: string;
    }[];
    pagination: PaginationTypes;
  };
}

export interface NotificationType {
  success: boolean;
  response: {
    notifications: {
      _id: string;
      title: string;
      message: string;
      createdAt: string;
      id: string;
    }[];
    pagination: PaginationTypes;
  };
}

interface SupportChatOverview {
  _id: string;
  createdAt: string;
  id: string;
  lastMessage: {
    _id: string;
    chat: string;
    createdAt: string;
    media?: string[];
    text: string;
    updatedAt?: string;
    user: string;
  };
  status: string;
  updatedAt?: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}

export interface ChatsListType {
  success: boolean;
  response: {
    supportChats: SupportChatOverview[];
    pagination: PaginationTypes;
  };
}

export interface SupportMessage {
  _id: string;
  chat: string;
  createdAt: string;
  id: string;
  media: string[];
  text: string;
  updatedAt?: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}

export interface ChatTypes {
  success: boolean;
  response: {
    supportMessages: SupportMessage[];
    pagination: PaginationTypes;
  };
}

