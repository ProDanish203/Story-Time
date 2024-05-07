import { format, formatDistanceToNowStrict } from "date-fns";

export const dateFormat = (date: string) => {
  return formatDistanceToNowStrict(new Date(date));
};

export const dateFormatMM = (date: string) => {
  return format(date, "MM/dd/yyyy");
};
