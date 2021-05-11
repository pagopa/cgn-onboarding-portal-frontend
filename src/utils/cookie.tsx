import Cookies from "universal-cookie";
import { AdminAccess } from "../authConfig";

const cookieKey = "pagopa_token";

export function setCookie(token: string) {
  const cookies = new Cookies();

  const now = new Date();
  const expiresDate = new Date(now.getTime() + 1000 * 60 * 60 * 8);

  const cookieOptions = {
    path: "/",
    expires: expiresDate,
    domain: window.location.hostname,
    secure: true
  };

  cookies.set(cookieKey, token, cookieOptions);
}

export const getCookie = () => {
  const cookies = new Cookies();
  return cookies.get(cookieKey);
};

export function deleteCookie() {
  const cookies = new Cookies();

  const cookieOptions = {
    path: "/",
    domain: window.location.hostname
  };

  cookies.remove(cookieKey, cookieOptions);
}

export function logout(userType: string) {
  deleteCookie();
  if (userType === "ADMIN") {
    void AdminAccess.logoutRedirect();
  }
  window.location.replace("/");
}
