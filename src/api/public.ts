import axios, { AxiosError } from 'axios';
import { HelpApi } from './generated_public';

export const axiosInstance = axios.create({
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
});

axiosInstance.interceptors.response.use((response) => response, (error: AxiosError) => error);

export default {
	NotLoggedHelp: new HelpApi(undefined, 'https://api.cgn-dev.caravan-azure.bitrock.it/public/v1', axiosInstance)
};
