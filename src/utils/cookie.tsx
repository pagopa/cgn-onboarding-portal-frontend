import Cookies from "universal-cookie";

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

export function logout() {
  deleteCookie();
  window.location.replace("/");
}

export function deleteCookie() {
  const cookies = new Cookies();

  const cookieOptions = {
    path: "/",
    domain: window.location.hostname
  };

  cookies.remove(cookieKey, cookieOptions);
}
