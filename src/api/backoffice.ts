import axios, { AxiosError } from "axios";
import { on401 } from "../authentication/authentication";
import { getAdminToken } from "../authentication/authenticationState";
import {
  AttributeauthorityApi,
  AgreementApi,
  DiscountApi,
  DocumentApi,
  ExportsApi
} from "./generated_backoffice/";

const token = getAdminToken();

export const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error?.response?.status === 401) {
      on401();
    }
    return error;
  }
);

export default {
  Agreement: new AgreementApi(
    undefined,
    process.env.BASE_BACKOFFICE_PATH,
    axiosInstance
  ),
  Discount: new DiscountApi(
    undefined,
    process.env.BASE_BACKOFFICE_PATH,
    axiosInstance
  ),
  Document: new DocumentApi(
    undefined,
    process.env.BASE_BACKOFFICE_PATH,
    axiosInstance
  ),
  Exports: new ExportsApi(
    undefined,
    process.env.BASE_BACKOFFICE_PATH,
    axiosInstance
  ),
  AttributeAuthority: new AttributeauthorityApi(
    undefined,
    process.env.BASE_BACKOFFICE_PATH,
    axiosInstance
  )
};
