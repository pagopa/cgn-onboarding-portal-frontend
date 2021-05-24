import * as Yup from 'yup';
import { HelpRequestCategoryEnum } from '../../api/generated';
import Help from '../../pages/Help';

const INCORRECT_EMAIL_ADDRESS = 'L’indirizzo inserito non è corretto';
const INCORRECT_CONFIRM_EMAIL_ADDRESS = 'I due indirizzi devono combaciare';
const REQUIRED_FIELD = 'Campo obbligatorio';
const ONLY_NUMBER = 'Solo numeri';
const ONLY_STRING = 'Solo lettere';
const DISCOUNT_RANGE = 'Lo sconto deve essere un numero intero compreso tra 5 e 100';
const PRODUCT_CATEGORIES_ONE = 'Selezionare almeno una categoria merceologica';
const INCORRECT_WEBSITE_URL = 'L’indirizzo inserito non è corretto';

export const ProfileDataValidationSchema = Yup.object().shape({
	hasDifferentName: Yup.boolean(),
	name: Yup.string().when([ 'hasDifferentName' ], {
		is: true,
		then: Yup.string().required(REQUIRED_FIELD)
	}),
	pecAddress: Yup.string().email(INCORRECT_EMAIL_ADDRESS).required(REQUIRED_FIELD),
	legalOffice: Yup.string().required(REQUIRED_FIELD),
	telephoneNumber: Yup.string()
		.matches(/^[0-9]*$/, ONLY_NUMBER)
		.min(4, 'Deve essere di 4 caratteri')
		.required(REQUIRED_FIELD),
	legalRepresentativeFullName: Yup.string().matches(/^[a-zA-Z\s]*$/, ONLY_STRING).required(REQUIRED_FIELD),
	legalRepresentativeTaxCode: Yup.string()
		.min(16, 'Deve essere di 16 caratteri')
		.max(16, 'Deve essere di 16 caratteri')
		.required(REQUIRED_FIELD),
	referent: Yup.object().shape({
		firstName: Yup.string().matches(/^[a-zA-Z\s]*$/, ONLY_STRING).required(REQUIRED_FIELD),
		lastName: Yup.string().matches(/^[a-zA-Z\s]*$/, ONLY_STRING).required(REQUIRED_FIELD),
		role: Yup.string().matches(/^[a-zA-Z\s]*$/, ONLY_STRING).required(REQUIRED_FIELD),
		emailAddress: Yup.string().email(INCORRECT_EMAIL_ADDRESS).required(REQUIRED_FIELD),
		telephoneNumber: Yup.string()
			.matches(/^[0-9]*$/, ONLY_NUMBER)
			.min(4, 'Deve essere di 4 caratteri')
			.required(REQUIRED_FIELD)
	}),
	description: Yup.string().required(REQUIRED_FIELD),
	salesChannel: Yup.object().shape({
		channelType: Yup.mixed().oneOf([ 'OnlineChannel', 'OfflineChannel', 'BothChannels' ]),
		websiteUrl: Yup.string().when('channelType', {
			is: (val: string) => val === 'OnlineChannel' || val === 'BothChannels',
			then: Yup.string()
				.matches(
					/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
					INCORRECT_WEBSITE_URL
				)
				.required(REQUIRED_FIELD)
		}),
		discountCodeType: Yup.string().when('channelType', {
			is: (val: string) => val === 'OnlineChannel' || val === 'BothChannels',
			then: Yup.string().required(REQUIRED_FIELD)
		}),
		addresses: Yup.array().when('channelType', {
			is: (val: string) => val === 'OfflineChannel' || val === 'BothChannels',
			then: Yup.array().of(
				Yup.object().shape({
					street: Yup.string().required(REQUIRED_FIELD),
					zipCode: Yup.string()
						.matches(/^[0-9]*$/, ONLY_NUMBER)
						.min(5, 'Deve essere di 5 caratteri')
						.max(5, 'Deve essere di 5 caratteri')
						.required(REQUIRED_FIELD),
					city: Yup.string().required(REQUIRED_FIELD),
					district: Yup.string().required(REQUIRED_FIELD)
				})
			)
		})
	})
});

export const discountDataValidationSchema = (staticCheck: boolean) =>
	Yup.object().shape({
		name: Yup.string().max(100).required(REQUIRED_FIELD),
		description: Yup.string().max(250),
		startDate: Yup.string().required(REQUIRED_FIELD),
		endDate: Yup.string().required(REQUIRED_FIELD),
		discount: Yup.number()
			.typeError(DISCOUNT_RANGE)
			.integer(DISCOUNT_RANGE)
			.min(5, DISCOUNT_RANGE)
			.max(100, DISCOUNT_RANGE)
			.required(REQUIRED_FIELD),
		productCategories: Yup.array().min(1, PRODUCT_CATEGORIES_ONE).required(),
		condition: Yup.string(),
		staticCode: Yup.string().when('condition', {
			is: () => staticCheck,
			then: Yup.string().required(REQUIRED_FIELD),
			otherwise: Yup.string()
		})
	});

export const discountsListDataValidationSchema = (staticCheck: boolean) =>
	Yup.object().shape({
		discounts: Yup.array().of(
			Yup.object().shape({
				name: Yup.string().max(100).required(REQUIRED_FIELD),
				description: Yup.string().max(250),
				startDate: Yup.string().required(REQUIRED_FIELD),
				endDate: Yup.string().required(REQUIRED_FIELD),
				productCategories: Yup.array().min(1, PRODUCT_CATEGORIES_ONE).required(REQUIRED_FIELD),
				discount: Yup.number()
					.typeError(DISCOUNT_RANGE)
					.integer(DISCOUNT_RANGE)
					.min(5, DISCOUNT_RANGE)
					.max(100, DISCOUNT_RANGE)
					.required(REQUIRED_FIELD),
				condition: Yup.string(),
				staticCode: Yup.string().when('condition', {
					is: () => staticCheck,
					then: Yup.string().required(REQUIRED_FIELD),
					otherwise: Yup.string()
				})
			})
		)
	});

export const loggedHelpValidationSchema = Yup.object().shape({
	category: Yup.string()
		.oneOf([
			HelpRequestCategoryEnum.Access,
			HelpRequestCategoryEnum.CgnOwnerReporting,
			HelpRequestCategoryEnum.DataFilling,
			HelpRequestCategoryEnum.Discounts,
			HelpRequestCategoryEnum.Documents,
			HelpRequestCategoryEnum.Other,
			HelpRequestCategoryEnum.Suggestions,
			HelpRequestCategoryEnum.TechnicalProblem
		])
		.required(REQUIRED_FIELD),
	topic: Yup.string().when([ 'category' ], {
		is:
			HelpRequestCategoryEnum.Discounts ||
			HelpRequestCategoryEnum.Documents ||
			HelpRequestCategoryEnum.DataFilling,
		then: Yup.string().required(REQUIRED_FIELD)
	}),
	message: Yup.string().required(REQUIRED_FIELD)
});

export const notLoggedHelpValidationSchema = Yup.object().shape({
	category: Yup.string()
		.oneOf([
			HelpRequestCategoryEnum.Access,
			HelpRequestCategoryEnum.CgnOwnerReporting,
			HelpRequestCategoryEnum.DataFilling,
			HelpRequestCategoryEnum.Discounts,
			HelpRequestCategoryEnum.Documents,
			HelpRequestCategoryEnum.Other,
			HelpRequestCategoryEnum.Suggestions,
			HelpRequestCategoryEnum.TechnicalProblem
		])
		.required(REQUIRED_FIELD),
	topic: Yup.string().when([ 'category' ], {
		is:
			HelpRequestCategoryEnum.Discounts ||
			HelpRequestCategoryEnum.Documents ||
			HelpRequestCategoryEnum.DataFilling,
		then: Yup.string().required(REQUIRED_FIELD)
	}),
	message: Yup.string().required(REQUIRED_FIELD),
	referentFirstName: Yup.string().matches(/^[a-zA-Z\s]*$/, ONLY_STRING).required(REQUIRED_FIELD),
	referentLastName: Yup.string().matches(/^[a-zA-Z\s]*$/, ONLY_STRING).required(REQUIRED_FIELD),
	legalName: Yup.string().matches(/^[a-zA-Z\s]*$/, ONLY_STRING).required(REQUIRED_FIELD),
	emailAddress: Yup.string().email(INCORRECT_EMAIL_ADDRESS).required(REQUIRED_FIELD),
	confirmEmailAddress: Yup.string().email(INCORRECT_EMAIL_ADDRESS).when('emailAddress', {
		is: (email: any) => (email && email.length > 0 ? true : false),
		then: Yup.string().oneOf([ Yup.ref('emailAddress') ], INCORRECT_CONFIRM_EMAIL_ADDRESS)
	}),
	recaptchaToken: Yup.string().required(REQUIRED_FIELD)
});
