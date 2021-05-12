import * as Yup from 'yup';

export const ProfileDataValidationSchema = Yup.object().shape({
	hasDifferentName: Yup.boolean(),
	name: Yup.string().when([ 'hasDifferentName' ], {
		is: true,
		then: Yup.string().required('Campo obbligatorio')
	}),
	pecAddress: Yup.string().email('Deve essere una email').required('Campo obbligatorio'),
	legalOffice: Yup.string().required('Campo obbligatorio'),
	telephoneNumber: Yup.string().phone('IT', false, 'Numero di telefono non valido').required('Campo obbligatorio'),
	legalRepresentativeFullName: Yup.string().matches(/^[a-zA-Z\s]*$/).required(),
	legalRepresentativeTaxCode: Yup.string()
		.min(16, 'Deve essere di 16 caratteri')
		.max(16, 'Deve essere di 16 caratteri')
		.required('Campo obbligatorio'),
	referent: Yup.object().shape({
		firstName: Yup.string().matches(/^[a-zA-Z\s]*$/).required('Campo obbligatorio'),
		lastName: Yup.string().matches(/^[a-zA-Z\s]*$/).required('Campo obbligatorio'),
		role: Yup.string().matches(/^[a-zA-Z\s]*$/).required('Campo obbligatorio'),
		emailAddress: Yup.string().email('Deve essere una email').required('Campo obbligatorio'),
		telephoneNumber: Yup.string().phone('IT', false, 'Numero di telefono non valido').required('Campo obbligatorio')
	}),
	description: Yup.string().required('Campo obbligatorio'),
	salesChannel: Yup.object().shape({
		channelType: Yup.mixed().oneOf([ 'OnlineChannel', 'OfflineChannel', 'BothChannels' ]),
		websiteUrl: Yup.string().when('channelType', {
			is: 'OnlineChannel' || 'BothChannels',
			then: Yup.string().required('Campo obbligatorio')
		}),
		discountCodeType: Yup.string().when('channelType', {
			is: 'OnlineChannel' || 'BothChannels',
			then: Yup.string().required('Campo obbligatorio')
		}),
		addresses: Yup.array().when('channelType', {
			is: 'OfflineChannel' || 'BothChannels',
			then: Yup.array().of(
				Yup.object().shape({
					street: Yup.string().required('Campo obbligatorio'),
					zipCode: Yup.string().matches(/^[0-9]*$/).required('Campo obbligatorio'),
					city: Yup.string().required('Campo obbligatorio'),
					district: Yup.string().required('Campo obbligatorio')
				})
			)
		})
	})
});

export const discountDataValidationSchema = Yup.object().shape({
	discounts: Yup.array().of(
		Yup.object().shape({
			name: Yup.string().max(100, 'Massimo 100 caratteri').required('Campo Obbligatorio'),
			description: Yup.string().max(250, 'Massimo 250 caratteri').required('Campo Obbligatorio'),
			startDate: Yup.string().required('Campo Obbligatorio'),
			endDate: Yup.string().required('Campo Obbligatorio'),
			discount: Yup.number()
				.min(1, 'Almeno un carattere')
				.max(100, 'Massimo 100 caratteri')
				.required('Campo Obbligatorio'),
			productCategories: Yup.array().min(1, 'Almeno un carattere').required(),
			condition: Yup.string().max(200, 'Massimo 200 caratteri'),
			staticCode: Yup.string()
		})
	)
});
