import axios, { AxiosError } from 'axios';
import { getCookie, logout } from '../utils/cookie';
import { AgreementApi, DiscountApi, DocumentApi } from './generated_backoffice/';

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
		logout('ADMIN');
	}
	return error;
  });

export default {
	Agreement: new AgreementApi(undefined, process.env.BASE_BACKOFFICE_PATH, axiosInstance),
	Discount: new DiscountApi(undefined, process.env.BASE_BACKOFFICE_PATH, axiosInstance),
	Document: new DocumentApi(undefined, process.env.BASE_BACKOFFICE_PATH, axiosInstance)
};
