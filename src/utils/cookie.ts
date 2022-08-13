export function getCookie(cookieKey: string, cookieString: any) {
  return cookieString
    .split(";")
    .find((cookie: any) => cookie.includes(cookieKey))
    .replace(cookieKey + "=", "")
    .replaceAll('"', "")
    .trim();
}
