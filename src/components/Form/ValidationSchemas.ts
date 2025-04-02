import * as Yup from "yup";
import { HelpRequestCategoryEnum, SalesChannelType } from "../../api/generated";
import { EntityType } from "../../api/generated_backoffice";
import { MAX_SELECTABLE_CATEGORIES } from "../../utils/constants";

const INCORRECT_EMAIL_ADDRESS = "L’indirizzo inserito non è corretto";
const INCORRECT_CONFIRM_EMAIL_ADDRESS = "I due indirizzi devono combaciare";
const REQUIRED_FIELD = "Campo obbligatorio";
const ONLY_NUMBER = "Solo numeri";
const ONLY_STRING = "Solo lettere";
const DISCOUNT_RANGE =
  "Lo sconto deve essere un numero intero compreso tra 1 e 100";
const PRODUCT_CATEGORIES_ONE = "Selezionare almeno una categoria merceologica";
const PRODUCT_CATEGORIES_MAX = `Selezionare al massimo ${MAX_SELECTABLE_CATEGORIES} categorie merceologiche`;
const INCORRECT_WEBSITE_URL =
  "L’indirizzo inserito non è corretto, inserire la URL comprensiva di protocollo";

const ReferentValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, ONLY_STRING)
    .required(REQUIRED_FIELD),
  lastName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, ONLY_STRING)
    .required(REQUIRED_FIELD),
  role: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, ONLY_STRING)
    .required(REQUIRED_FIELD),
  emailAddress: Yup.string()
    .email(INCORRECT_EMAIL_ADDRESS)
    .required(REQUIRED_FIELD),
  telephoneNumber: Yup.string()
    .matches(/^[0-9]*$/, ONLY_NUMBER)
    .min(4, "Deve essere di 4 caratteri")
    .required(REQUIRED_FIELD)
});

export const ProfileDataValidationSchema = Yup.object().shape({
  hasDifferentName: Yup.boolean(),
  name: Yup.string().when(["hasDifferentName"], {
    is: true,
    then: Yup.string().required(REQUIRED_FIELD)
  }),
  name_en: Yup.string().when(["hasDifferentName"], {
    is: true,
    then: Yup.string().required(REQUIRED_FIELD)
  }),
  name_de: Yup.string().when(["hasDifferentName"], {
    is: true,
    then: Yup.string().required(REQUIRED_FIELD)
  }),
  pecAddress: Yup.string()
    .email(INCORRECT_EMAIL_ADDRESS)
    .required(REQUIRED_FIELD),
  legalOffice: Yup.string().required(REQUIRED_FIELD),
  telephoneNumber: Yup.string()
    .matches(/^[0-9]*$/, ONLY_NUMBER)
    .min(4, "Deve essere di 4 caratteri")
    .required(REQUIRED_FIELD),
  legalRepresentativeFullName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, ONLY_STRING)
    .required(REQUIRED_FIELD),
  legalRepresentativeTaxCode: Yup.string()
    .min(4, "Deve essere al minimo di 4 caratteri")
    .max(20, "Deve essere al massimo di 20 caratteri")
    .required(REQUIRED_FIELD),
  referent: ReferentValidationSchema,
  secondaryReferents: Yup.array()
    .of(ReferentValidationSchema)
    .required(REQUIRED_FIELD),
  description: Yup.string().required(REQUIRED_FIELD),
  description_en: Yup.string().required(REQUIRED_FIELD),
  description_de: Yup.string().required(REQUIRED_FIELD),
  salesChannel: Yup.object().shape({
    channelType: Yup.mixed().oneOf([
      "OnlineChannel",
      "OfflineChannel",
      "BothChannels"
    ]),
    websiteUrl: Yup.string()
      .nullable()
      .when("channelType", {
        is: (val: string) => val === "OnlineChannel" || val === "BothChannels",
        then: schema =>
          schema.url(INCORRECT_WEBSITE_URL).required(REQUIRED_FIELD)
      }),
    discountCodeType: Yup.string().when("channelType", {
      is: (val: string) => val === "OnlineChannel" || val === "BothChannels",
      then: Yup.string().required(REQUIRED_FIELD)
    }),
    allNationalAddresses: Yup.boolean().required(REQUIRED_FIELD),
    addresses: Yup.array().when(["channelType", "allNationalAddresses"], {
      is: (channel: string, allNationalAddresses: boolean) =>
        (channel === SalesChannelType.OfflineChannel ||
          channel === SalesChannelType.BothChannels) &&
        !allNationalAddresses,
      then: Yup.array()
        .of(
          Yup.object().shape({
            street: Yup.string()
              .matches(/^[A-Za-z0-9\s]*$/, "Solo lettere o numeri")
              .required(REQUIRED_FIELD),
            zipCode: Yup.string()
              .matches(/^[0-9]*$/, ONLY_NUMBER)
              .min(5, "Deve essere di 5 caratteri")
              .max(5, "Deve essere di 5 caratteri")
              .required(REQUIRED_FIELD),
            city: Yup.string().required(REQUIRED_FIELD),
            district: Yup.string().required(REQUIRED_FIELD),
            coordinates: Yup.object().shape({
              latitude: Yup.string().notRequired(),
              longitude: Yup.string().notRequired()
            }),
            label: Yup.string(),
            value: Yup.string()
          })
        )
        .required(REQUIRED_FIELD),
      otherwise: Yup.array().notRequired()
    })
  })
});

/**
 * Check if Eyca Landing Page URL is different from Discount URL
 */
const checkEycaLandingDifferentFromLandingPageUrl = (
  landingPageUrl: string,
  schema: any
) => {
  if (landingPageUrl) {
    return schema.notOneOf(
      [landingPageUrl],
      "L'url della EYCA non può essere uguale all'url della landing page"
    );
  }
  return schema;
};

export const discountDataValidationSchema = (
  staticCheck: boolean,
  landingCheck: boolean,
  bucketCheck: boolean
) =>
  Yup.object().shape(
    {
      name: Yup.string().max(100).required(REQUIRED_FIELD),
      name_en: Yup.string().max(100).required(REQUIRED_FIELD),
      name_de: Yup.string().max(100).required(REQUIRED_FIELD),
      description: Yup.string().when(["description_en"], {
        is: (_?: string) => _ && _.length > 0,
        then: Yup.string().required(REQUIRED_FIELD).max(250)
      }),
      description_en: Yup.string().when(["description"], {
        is: (_?: string) => _ && _.length > 0,
        then: Yup.string().required(REQUIRED_FIELD).max(250)
      }),
      description_de: Yup.string().when(["description"], {
        is: (_?: string) => _ && _.length > 0,
        then: Yup.string().required(REQUIRED_FIELD).max(250)
      }),
      discountUrl: Yup.string().url(INCORRECT_WEBSITE_URL),
      startDate: Yup.string().required(REQUIRED_FIELD),
      endDate: Yup.string().required(REQUIRED_FIELD),
      discount: Yup.number()
        .typeError(DISCOUNT_RANGE)
        .integer(DISCOUNT_RANGE)
        .min(1, DISCOUNT_RANGE)
        .max(100, DISCOUNT_RANGE)
        .notRequired(),
      productCategories: Yup.array()
        .min(1, PRODUCT_CATEGORIES_ONE)
        .max(MAX_SELECTABLE_CATEGORIES, PRODUCT_CATEGORIES_MAX)
        .required(REQUIRED_FIELD),
      condition: Yup.string().when(["condition_en"], {
        is: (_?: string) => _ && _.length > 0,
        then: Yup.string().required(REQUIRED_FIELD)
      }),
      condition_en: Yup.string().when(["condition"], {
        is: (_?: string) => _ && _.length > 0,
        then: Yup.string().required(REQUIRED_FIELD)
      }),
      condition_de: Yup.string().when(["condition"], {
        is: (_?: string) => _ && _.length > 0,
        then: Yup.string().required(REQUIRED_FIELD)
      }),
      staticCode: Yup.string().when("condition", {
        is: () => staticCheck,
        then: Yup.string().required(REQUIRED_FIELD),
        otherwise: Yup.string()
      }),
      landingPageUrl: Yup.string().when("condition", {
        is: () => landingCheck,
        then: Yup.string().url(INCORRECT_WEBSITE_URL).required(REQUIRED_FIELD),
        otherwise: Yup.string()
      }),
      landingPageReferrer: Yup.string().when("condition", {
        is: () => landingCheck,
        then: Yup.string().required(REQUIRED_FIELD),
        otherwise: Yup.string()
      }),
      lastBucketCodeLoadUid: Yup.string().when("condition", {
        is: () => bucketCheck,
        then: Yup.string().required(REQUIRED_FIELD),
        otherwise: Yup.string()
      }),
      lastBucketCodeLoadFileName: Yup.string().when("condition", {
        is: () => bucketCheck,
        then: Yup.string().required(REQUIRED_FIELD),
        otherwise: Yup.string()
      }),
      visibleOnEyca: Yup.boolean(),
      eycaLandingPageUrl: Yup.string().when("visibleOnEyca", {
        is: (visibleOnEyca: boolean) => visibleOnEyca && landingCheck,
        then: schema =>
          schema
            .url(INCORRECT_WEBSITE_URL)
            .when(
              "landingPageUrl",
              checkEycaLandingDifferentFromLandingPageUrl
            ),
        otherwise: schema => schema.nullable().oneOf([undefined, null, ""])
      })
    },
    [
      ["description", "description_en"],
      ["condition", "condition_en"]
    ]
  );

export const discountsListDataValidationSchema = (
  staticCheck: boolean,
  landingCheck: boolean,
  bucketCheck: boolean
) =>
  Yup.object().shape({
    discounts: Yup.array().of(
      discountDataValidationSchema(staticCheck, landingCheck, bucketCheck)
    )
  });

export const helpTopicRequiresCategory = (category: HelpRequestCategoryEnum) =>
  category === HelpRequestCategoryEnum.Discounts ||
  category === HelpRequestCategoryEnum.Documents ||
  category === HelpRequestCategoryEnum.DataFilling;

export const loggedHelpValidationSchema = Yup.object().shape({
  category: Yup.string()
    .oneOf(Object.values(HelpRequestCategoryEnum))
    .required(REQUIRED_FIELD),
  topic: Yup.string().when(["category"], {
    is: helpTopicRequiresCategory,
    then: Yup.string().required(REQUIRED_FIELD)
  }),
  message: Yup.string().required(REQUIRED_FIELD)
});

export const notLoggedHelpValidationSchema = Yup.object().shape({
  category: Yup.string()
    .oneOf(Object.values(HelpRequestCategoryEnum))
    .required(REQUIRED_FIELD),
  topic: Yup.string().when(["category"], {
    is: helpTopicRequiresCategory,
    then: Yup.string().required(REQUIRED_FIELD)
  }),
  message: Yup.string().required(REQUIRED_FIELD),
  referentFirstName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, ONLY_STRING)
    .required(REQUIRED_FIELD),
  referentLastName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, ONLY_STRING)
    .required(REQUIRED_FIELD),
  legalName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, ONLY_STRING)
    .required(REQUIRED_FIELD),
  emailAddress: Yup.string()
    .email(INCORRECT_EMAIL_ADDRESS)
    .required(REQUIRED_FIELD),
  confirmEmailAddress: Yup.string()
    .email(INCORRECT_EMAIL_ADDRESS)
    .when("emailAddress", {
      is: (email: string | undefined) => (email?.length ?? 0) > 0,
      then: Yup.string()
        .oneOf([Yup.ref("emailAddress")], INCORRECT_CONFIRM_EMAIL_ADDRESS)
        .required(REQUIRED_FIELD)
    }),
  recaptchaToken: Yup.string().required(REQUIRED_FIELD)
});

export const activationValidationSchema = Yup.object().shape({
  keyOrganizationFiscalCode: Yup.string(),
  organizationFiscalCode: Yup.string().required(REQUIRED_FIELD),
  organizationName: Yup.string().required(REQUIRED_FIELD),
  pec: Yup.string().email(INCORRECT_EMAIL_ADDRESS).required(REQUIRED_FIELD),
  referents: Yup.array()
    .of(
      Yup.string()
        .min(4, "Deve essere al minimo di 4 caratteri")
        .max(20, "Deve essere al massimo di 20 caratteri")
        .required(REQUIRED_FIELD)
    )
    .required(REQUIRED_FIELD),
  insertedAt: Yup.string(),
  entityType: Yup.string()
    .oneOf(Object.values(EntityType), REQUIRED_FIELD)
    .required(REQUIRED_FIELD)
});
