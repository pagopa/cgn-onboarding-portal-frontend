import Cookies from "universal-cookie";
import Axios from "axios";
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
  return cookies.get<string | undefined>(cookieKey);
};

export function deleteCookie() {
  const cookies = new Cookies();

  const cookieOptions = {
    path: "/",
    domain: window.location.hostname
  };

  cookies.remove(cookieKey, cookieOptions);
}

const invalidate = async () => {
  const token = getCookie();
  await Axios.post(`${process.env.BASE_SPID_LOGIN_PATH}/invalidate`, {
    token
  });
  deleteCookie();
  window.location.replace("/");
};

export function logout(userType: string) {
  if (userType === "ADMIN") {
    void AdminAccess.logoutRedirect();
    deleteCookie();
  } else if (userType === "USER") {
    void invalidate();
  }
}
