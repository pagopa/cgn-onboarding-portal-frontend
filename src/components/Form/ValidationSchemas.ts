import * as Yup from 'yup';

const INCORRECT_EMAIL_ADDRESS = 'L’indirizzo inserito non è corretto';
const REQUIRED_FIELD = 'Campo obbligatorio';
const ONLY_NUMBER = 'Solo numeri';
const ONLY_STRING = 'Solo lettere';
const DISCOUNT_RANGE = 'Lo sconto deve essere un numero intero compreso tra 0 e 100';
const PRODUCT_CATEGORIES_ONE = 'Selezionare almeno una categoria merceologica';

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
			then: Yup.string().required(REQUIRED_FIELD)
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
					zipCode: Yup.string().matches(/^[0-9]*$/, ONLY_NUMBER)
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

export const discountDataValidationSchema = Yup.object().shape({
	name: Yup.string().max(100).required(REQUIRED_FIELD),
	description: Yup.string().max(250),
	startDate: Yup.string().required(REQUIRED_FIELD),
	endDate: Yup.string().required(REQUIRED_FIELD),
	discount: Yup.number()
		.integer(DISCOUNT_RANGE)
		.min(5, DISCOUNT_RANGE)
		.max(100, DISCOUNT_RANGE)
		.required(REQUIRED_FIELD),
	productCategories: Yup.array().min(1, PRODUCT_CATEGORIES_ONE).required(),
	condition: Yup.string(),
	staticCode: Yup.string()
});

export const discountsListDataValidationSchema = Yup.object().shape({
	discounts: Yup.array().of(
		Yup.object().shape({
			name: Yup.string().max(100).required(REQUIRED_FIELD),
			description: Yup.string().max(250),
			startDate: Yup.string().required(REQUIRED_FIELD),
			endDate: Yup.string().required(REQUIRED_FIELD),
			productCategories: Yup.array().min(1, PRODUCT_CATEGORIES_ONE).required(REQUIRED_FIELD),
			discount: Yup.number()
				.integer(DISCOUNT_RANGE)
				.min(5, DISCOUNT_RANGE)
				.max(100, DISCOUNT_RANGE)
				.required(REQUIRED_FIELD),
			condition: Yup.string(),
			staticCode: Yup.string()
		})
	)
});
