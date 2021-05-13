import * as Yup from 'yup';

const INCORRECT_EMAIL_ADDRESS = 'L’indirizzo inserito non è corretto';
const REQUIRED_FIELD = 'Campo obbligato';
const DISCOUNT_RANGE = 'Lo sconto deve essere compreso tra 0 e 100';
const PRODUCT_CATEGORIES_ONE = 'Selezionare almeno una categoria merceologica';
const INCORRECT_TELEPHONE_NUMBER = 'Numero di telefono non valido';
const INCORRECT_TAX_CODE_OR_VAT = 'Il numero di caratteri inseriti non è corretto';

export const ProfileDataValidationSchema = Yup.object().shape({
	hasDifferentName: Yup.boolean(),
	name: Yup.string().when([ 'hasDifferentName' ], {
		is: true,
		then: Yup.string().required(REQUIRED_FIELD)
	}),
	pecAddress: Yup.string().email(INCORRECT_EMAIL_ADDRESS).required(REQUIRED_FIELD),
	legalOffice: Yup.string().required(REQUIRED_FIELD),
	telephoneNumber: Yup.string().phone('IT', false, INCORRECT_TELEPHONE_NUMBER).required(REQUIRED_FIELD),
	legalRepresentativeFullName: Yup.string().matches(/^[a-zA-Z\s]*$/).required(),
	legalRepresentativeTaxCode: Yup.string()
		.min(16, 'Deve essere di 16 caratteri')
		.max(16, 'Deve essere di 16 caratteri')
		.required(REQUIRED_FIELD),
	referent: Yup.object().shape({
		firstName: Yup.string().matches(/^[a-zA-Z\s]*$/).required(REQUIRED_FIELD),
		lastName: Yup.string().matches(/^[a-zA-Z\s]*$/).required(REQUIRED_FIELD),
		role: Yup.string().matches(/^[a-zA-Z\s]*$/).required(REQUIRED_FIELD),
		emailAddress: Yup.string().email(INCORRECT_EMAIL_ADDRESS).required(REQUIRED_FIELD),
		telephoneNumber: Yup.string().phone('IT', false, INCORRECT_TELEPHONE_NUMBER).required(REQUIRED_FIELD)
	}),
	description: Yup.string().required(REQUIRED_FIELD),
	salesChannel: Yup.object().shape({
		channelType: Yup.mixed().oneOf([ 'OnlineChannel', 'OfflineChannel', 'BothChannels' ]),
		websiteUrl: Yup.string().when('channelType', {
			is: 'OnlineChannel' || 'BothChannels',
			then: Yup.string().required(REQUIRED_FIELD)
		}),
		discountCodeType: Yup.string().when('channelType', {
			is: 'OnlineChannel' || 'BothChannels',
			then: Yup.string().required(REQUIRED_FIELD)
		}),
		addresses: Yup.array().when('channelType', {
			is: 'OfflineChannel' || 'BothChannels',
			then: Yup.array().of(
				Yup.object().shape({
					street: Yup.string().required(REQUIRED_FIELD),
					zipCode: Yup.string().matches(/^[0-9]*$/).required(REQUIRED_FIELD),
					city: Yup.string().required(REQUIRED_FIELD),
					district: Yup.string().required(REQUIRED_FIELD)
				})
			)
		})
	})
});

export const discountDataValidationSchema = Yup.object().shape({
	discounts: Yup.array().of(
		Yup.object().shape({
			name: Yup.string().max(100).required(REQUIRED_FIELD),
			description: Yup.string().max(250).required(REQUIRED_FIELD),
			startDate: Yup.string().required(REQUIRED_FIELD),
			endDate: Yup.string().required(REQUIRED_FIELD),
			discount: Yup.number().min(1, DISCOUNT_RANGE).max(100, DISCOUNT_RANGE).required(REQUIRED_FIELD),
			productCategories: Yup.array().min(1, PRODUCT_CATEGORIES_ONE).required(),
			condition: Yup.string(),
			staticCode: Yup.string()
		})
	)
});
