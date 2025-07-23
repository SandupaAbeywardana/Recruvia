import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Router from "next/router";

const BaseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: BaseURL,
});

export const apiPrivate = axios.create({
  baseURL: BaseURL,
});

apiPrivate.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiPrivate.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.", {
        toastId: "session-expired",
      });
      Cookies.remove("token");
      Router.push("/login");
    }
    return Promise.reject(error);
  }
);
