import Axios from "axios";
import { toError } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import Cookies from "universal-cookie";
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

const invalidate = () => {
  const token = getCookie();
  void pipe(
    TE.tryCatch(
      () =>
        Axios.post(`${process.env.BASE_SPID_LOGIN_PATH}/invalidate`, {
          token
        }),
      toError
    ),
    TE.map(chainAxios),
    TE.map(_ => {
      deleteCookie();
      window.location.replace("/");
    }),
    TE.mapLeft(_ => {
      deleteCookie();
      window.location.replace("/");
    })
  )();
};

export function logout(userType: string) {
  if (userType === "ADMIN") {
    void AdminAccess.logoutRedirect();
    deleteCookie();
  } else if (userType === "USER") {
    invalidate();
  }
}
