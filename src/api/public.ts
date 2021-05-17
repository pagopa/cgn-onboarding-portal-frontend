import axios, { AxiosError } from 'axios';
import { getCookie, logout } from '../utils/cookie';
import { HelpApi } from './generated_public';

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
    NotLoggedHelp: new HelpApi(undefined, process.env.BASE_API_PATH, axiosInstance),
};
