import axios, { AxiosError } from "axios";
import { getCookie, logout } from "../utils/cookie";
import {
  AgreementApi,
  ApiTokenApi,
  BucketApi,
  DiscountApi,
  DiscountBucketLoadingProgressApi,
  DocumentApi,
  DocumentTemplateApi,
  GeolocationTokenApi,
  HelpApi,
  ProfileApi
} from "./generated";

const token = getCookie();

const baseApiPath =
  process.env.NODE_ENV === "local"
    ? `${process.env.BASE_API_DOMAIN}`
    : `${process.env.BASE_API_DOMAIN}/api/v1`;

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
      logout("USER");
    }
    return error;
  }
);

export default {
  Agreement: new AgreementApi(undefined, baseApiPath, axiosInstance),
  Profile: new ProfileApi(undefined, baseApiPath, axiosInstance),
  Discount: new DiscountApi(undefined, baseApiPath, axiosInstance),
  Bucket: new BucketApi(undefined, baseApiPath, axiosInstance),
  Document: new DocumentApi(undefined, baseApiPath, axiosInstance),
  DocumentTemplate: new DocumentTemplateApi(
    undefined,
    baseApiPath,
    axiosInstance
  ),
  ApiToken: new ApiTokenApi(undefined, baseApiPath, axiosInstance),
  Help: new HelpApi(undefined, baseApiPath, axiosInstance),
  GeolocationToken: new GeolocationTokenApi(
    undefined,
    baseApiPath,
    axiosInstance
  ),
  DiscountBucketLoadingProgress: new DiscountBucketLoadingProgressApi(
    undefined,
    baseApiPath,
    axiosInstance
  )
};
