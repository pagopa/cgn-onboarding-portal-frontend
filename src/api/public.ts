import axios from "axios";
import { HelpApi, SessionApi } from "./generated_public";

export const axiosInstance = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  Help: new HelpApi(undefined, process.env.BASE_PUBLIC_PATH, axiosInstance),
  Session: new SessionApi(
    undefined,
    process.env.BASE_PUBLIC_PATH,
    axiosInstance
  )
};
