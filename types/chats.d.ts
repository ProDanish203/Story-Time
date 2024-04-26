enum EMessageStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  SEEN = "seen",
}

enum MessageType {
  message = "message",
  request = "request",
  pause = "pause",
  relieve = "relieve",
  proceed = "proceed",
  invoice = "invoice",
  complete = "complete",
  system = "system",
}

export enum EChatType {
  GROUP = "group",
  ONE_TO_ONE = "one-to-one",
}

export interface IReceivedBy {
  user: string;
  status: EMessageStatus;
  createdAt: Date;
  deleted: boolean;
  deletedAt?: Date;
}
export interface Message {
  body: string;
  createdAt?: Date;
  mediaUrls?: string[];
  mediaType?: string;
  sentBy: string;
  type?: MessageType;
  receivedBy?: IReceivedBy[];
  requestId?: string;
  deleted?: boolean;
  deletedAt?: Date;
}

export interface IParticipant {
  user: string;
  status: string;
  isMuted: boolean;
  isBlocked: boolean;
}

export interface Chat {
  _id?: string;
  groupName?: string;
  isChatSupport: boolean;
  isTicketClosed: boolean;
  groupImageUrl?: string;
  chatType: EChatType;
  createdBy?: string;
  messages: Message[];
  lastUpdatedAt: Date;
  participants: IParticipant[];
  task: string | Types.ObjectId;
  // requests: IRequest[];
  deleted: boolean;
  deletedAt?: Date;
}

export interface SubServices {
  _id: string;
  parent: string;
  title: string;
}

export interface Service {
  _id: string;
  title: string;
  type: string;
  subServices?: SubServices[];
}
