import Cookies from "universal-cookie";
import Axios from "axios";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { AdminAccess } from "../authConfig";
import chainAxios from "./chainAxios";

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

const invalidate = async () => {
  const token = getCookie();
  await tryCatch(
    () =>
      Axios.post(`${process.env.BASE_SPID_LOGIN_PATH}/invalidate`, {
        token
      }),
    toError
  )
    .chain(chainAxios)
    .fold(
      () => {
        deleteCookie();
        window.location.replace("/");
      },
      () => {
        deleteCookie();
        window.location.replace("/");
      }
    )
    .run();
};

export function logout(userType: string) {
  if (userType === "ADMIN") {
    void AdminAccess.logoutRedirect();
    deleteCookie();
    window.location.replace("/");
  } else if (userType === "USER") {
    void invalidate();
  }
}
