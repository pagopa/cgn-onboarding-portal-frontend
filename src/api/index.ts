import axios, { AxiosError } from 'axios';
import { getCookie, logout } from '../utils/cookie';
import {AgreementApi, ProfileApi, DiscountApi, DocumentApi, DocumentTemplateApi, ApiTokenApi, HelpApi, GeolocationTokenApi } from './generated';

const token = getCookie();

export const axiosInstance = axios.create({
	headers: {
		Authorization: `Bearer ${token}`,
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
});

axiosInstance.interceptors.response.use(
	response => response,
	(error: AxiosError) => {
	if (error?.response?.status === 401) {
		logout('USER');
	}
	return error;
  });


export default {
	Agreement: new AgreementApi(undefined, process.env.BASE_API_PATH, axiosInstance),
	Profile: new ProfileApi(undefined, process.env.BASE_API_PATH, axiosInstance),
	Discount: new DiscountApi(undefined, process.env.BASE_API_PATH, axiosInstance),
	Document: new DocumentApi(undefined, process.env.BASE_API_PATH, axiosInstance),
	DocumentTemplate: new DocumentTemplateApi(undefined, process.env.BASE_API_PATH, axiosInstance),
	ApiToken: new ApiTokenApi(undefined, process.env.BASE_API_PATH, axiosInstance),
	Help: new HelpApi(undefined, process.env.BASE_API_PATH, axiosInstance), 
	GeolocationToken: new GeolocationTokenApi(undefined, process.env.BASE_API_PATH, axiosInstance), 
};
