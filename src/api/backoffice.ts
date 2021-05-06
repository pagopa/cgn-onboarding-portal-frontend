import axios from 'axios';
import { getCookie } from '../utils/cookie';
import { AgreementApi, DiscountApi, DocumentApi } from './generated_backoffice/';

const token = getCookie();

export const axiosInstance = axios.create({
	headers: {
		Authorization: `Bearer ${token}`,
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
});

export default {
	Agreement: new AgreementApi(undefined, process.env.BASE_BACKOFFICE_PATH, axiosInstance),
	Discount: new DiscountApi(undefined, process.env.BASE_BACKOFFICE_PATH, axiosInstance),
	Document: new DocumentApi(undefined, process.env.BASE_BACKOFFICE_PATH, axiosInstance)
};
