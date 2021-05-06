import axios from 'axios';
import { getCookie } from '../utils/cookie';
import { AgreementApi, ProfileApi, DiscountApi, DocumentApi } from './generated';

const token = getCookie();

export const axiosInstance = axios.create({
	headers: {
		Authorization: `Bearer ${token}`,
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
});

export default {
	Agreement: new AgreementApi(undefined, process.env.BASE_API_PATH, axiosInstance),
	Profile: new ProfileApi(undefined, process.env.BASE_API_PATH, axiosInstance),
	Discount: new DiscountApi(undefined, process.env.BASE_API_PATH, axiosInstance),
	Document: new DocumentApi(undefined, process.env.BASE_API_PATH, axiosInstance),
};
