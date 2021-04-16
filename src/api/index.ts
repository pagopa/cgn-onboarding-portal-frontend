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
	Agreement: new AgreementApi(undefined, undefined, axiosInstance),
	Profile: new ProfileApi(undefined, undefined, axiosInstance),
	Discount: new DiscountApi(undefined, undefined, axiosInstance),
	Document: new DocumentApi(undefined, undefined, axiosInstance),
};
