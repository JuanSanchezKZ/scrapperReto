import dayjs from "dayjs";

export function parseDate(rawDateElement: string) {
  return dayjs(rawDateElement).isValid()
    ? dayjs(rawDateElement).toDate()
    : null;
}
