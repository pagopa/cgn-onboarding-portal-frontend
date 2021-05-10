import Cookies from "universal-cookie";
import { AdminAccess } from "../authConfig";

const cookieKey = "pagopa_token";
const cookieCompany = "pagopa_company";

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

export function setCompanyCookie(token: string) {
  const cookies = new Cookies();

  const now = new Date();
  const expiresDate = new Date(now.getTime() + 1000 * 60 * 60 * 8);

  const cookieOptions = {
    path: "/",
    expires: expiresDate,
    domain: window.location.hostname,
    secure: true
  };

  cookies.set(cookieCompany, token, cookieOptions);
}

export const getCompanyCookie = () => {
  const cookies = new Cookies();
  return cookies.get(cookieCompany);
};

export function deleteCookie() {
  const cookies = new Cookies();

  const cookieOptions = {
    path: "/",
    domain: window.location.hostname
  };

  cookies.remove(cookieKey, cookieOptions);
  cookies.remove(cookieCompany, cookieOptions);
}

export function logout(userType: string) {
  deleteCookie();
  if (userType === "ADMIN") {
    AdminAccess.logout();
  }
  window.location.replace("/");
}
