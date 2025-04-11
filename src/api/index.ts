import axios, { AxiosError } from "axios";
import { on401 } from "../authentication/LoginRedirect";
import { getMerchantToken } from "../authentication/authenticationState";
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

const token = getMerchantToken();

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
    process.env.BASE_API_PATH,
    axiosInstance
  ),
  Profile: new ProfileApi(undefined, process.env.BASE_API_PATH, axiosInstance),
  Discount: new DiscountApi(
    undefined,
    process.env.BASE_API_PATH,
    axiosInstance
  ),
  Bucket: new BucketApi(undefined, process.env.BASE_API_PATH, axiosInstance),
  Document: new DocumentApi(
    undefined,
    process.env.BASE_API_PATH,
    axiosInstance
  ),
  DocumentTemplate: new DocumentTemplateApi(
    undefined,
    process.env.BASE_API_PATH,
    axiosInstance
  ),
  ApiToken: new ApiTokenApi(
    undefined,
    process.env.BASE_API_PATH,
    axiosInstance
  ),
  Help: new HelpApi(undefined, process.env.BASE_API_PATH, axiosInstance),
  GeolocationToken: new GeolocationTokenApi(
    undefined,
    process.env.BASE_API_PATH,
    axiosInstance
  ),
  DiscountBucketLoadingProgress: new DiscountBucketLoadingProgressApi(
    undefined,
    process.env.BASE_API_PATH,
    axiosInstance
  )
};
