import * as Yup from "yup";
import { HelpRequestCategoryEnum, SupportType } from "../../api/generated";
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
const INCORRECT_PHONE_NUMBER = "Il numero di telefono inserito non è corretto";

const URL_REGEXP = /^([a-z]*:)?\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g;

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
  referent: Yup.object().shape({
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
  }),
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
        then: Yup.string()
          .matches(URL_REGEXP, INCORRECT_WEBSITE_URL)
          .required(REQUIRED_FIELD)
      }),
    discountCodeType: Yup.string().when("channelType", {
      is: (val: string) => val === "OnlineChannel" || val === "BothChannels",
      then: Yup.string().required(REQUIRED_FIELD)
    }),
    allNationalAddresses: Yup.boolean().required(REQUIRED_FIELD),
    addresses: Yup.array().when(["channelType", "allNationalAddresses"], {
      is: (channel: string, allNationalAddr: boolean) =>
        (channel === "OfflineChannel" || channel === "BothChannels") &&
        !allNationalAddr,
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
  }),
  supportType: Yup.mixed<SupportType>()
    .oneOf(Object.values(SupportType))
    .required(REQUIRED_FIELD),
  supportValue: Yup.string()
    .required(REQUIRED_FIELD)
    .when("supportType", {
      is: SupportType.EmailAddress,
      then: schema => schema.email(INCORRECT_EMAIL_ADDRESS)
    })
    .when("supportType", {
      is: SupportType.PhoneNumber,
      then: schema => schema.matches(/^[0-9]{4,}$/, INCORRECT_PHONE_NUMBER)
    })
    .when("supportType", {
      is: SupportType.Website,
      then: schema => schema.matches(URL_REGEXP, INCORRECT_WEBSITE_URL)
    })
});

export const discountDataValidationSchema = (
  staticCheck: boolean,
  landingCheck?: boolean,
  bucketCheck?: boolean
) =>
  Yup.object().shape(
    {
      name: Yup.string()
        .max(100)
        .required(REQUIRED_FIELD),
      name_en: Yup.string()
        .max(100)
        .required(REQUIRED_FIELD),
      name_de: Yup.string()
        .max(100)
        .required(REQUIRED_FIELD),
      description: Yup.string().when(["description_en"], {
        is: (_?: string) => _ && _.length > 0,
        then: Yup.string()
          .required(REQUIRED_FIELD)
          .max(250)
      }),
      description_en: Yup.string().when(["description"], {
        is: (_?: string) => _ && _.length > 0,
        then: Yup.string()
          .required(REQUIRED_FIELD)
          .max(250)
      }),
      description_de: Yup.string().when(["description"], {
        is: (_?: string) => _ && _.length > 0,
        then: Yup.string()
          .required(REQUIRED_FIELD)
          .max(250)
      }),
      discountUrl: Yup.string().matches(URL_REGEXP, INCORRECT_WEBSITE_URL),
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
        .required(),
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
        then: Yup.string().required(REQUIRED_FIELD),
        otherwise: Yup.string()
      }),
      landingPageReferrer: Yup.string(),
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
      visibleOnEyca: Yup.boolean()
    },
    [
      ["description", "description_en"],
      ["condition", "condition_en"]
    ]
  );

export const discountsListDataValidationSchema = (
  staticCheck: boolean,
  landingCheck?: boolean,
  bucketCheck?: boolean
) =>
  Yup.object().shape({
    discounts: Yup.array().of(
      Yup.object().shape(
        {
          name: Yup.string()
            .max(100)
            .required(REQUIRED_FIELD),
          name_en: Yup.string()
            .max(100)
            .required(REQUIRED_FIELD),
          name_de: Yup.string()
            .max(100)
            .required(REQUIRED_FIELD),
          description: Yup.string().when(["description_en"], {
            is: (_?: string) => _ && _.length > 0,
            then: Yup.string()
              .required(REQUIRED_FIELD)
              .max(250)
          }),
          description_en: Yup.string().when(["description"], {
            is: (_?: string) => _ && _.length > 0,
            then: Yup.string()
              .required(REQUIRED_FIELD)
              .max(250)
          }),
          description_de: Yup.string().when(["description"], {
            is: (_?: string) => _ && _.length > 0,
            then: Yup.string()
              .required(REQUIRED_FIELD)
              .max(250)
          }),
          discountUrl: Yup.string().matches(URL_REGEXP, INCORRECT_WEBSITE_URL),
          startDate: Yup.string().required(REQUIRED_FIELD),
          endDate: Yup.string().required(REQUIRED_FIELD),
          productCategories: Yup.array()
            .min(1, PRODUCT_CATEGORIES_ONE)
            .required(REQUIRED_FIELD),
          discount: Yup.number()
            .typeError(DISCOUNT_RANGE)
            .integer(DISCOUNT_RANGE)
            .min(1, DISCOUNT_RANGE)
            .max(100, DISCOUNT_RANGE)
            .notRequired(),
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
            then: Yup.string().required(REQUIRED_FIELD),
            otherwise: Yup.string()
          }),
          landingPageReferrer: Yup.string(),
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
          visibleOnEyca: Yup.boolean()
        },
        [
          ["description", "description_en"],
          ["condition", "condition_en"]
        ]
      )
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
  topic: Yup.string().when(["category"], {
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
  topic: Yup.string().when(["category"], {
    is:
      HelpRequestCategoryEnum.Discounts ||
      HelpRequestCategoryEnum.Documents ||
      HelpRequestCategoryEnum.DataFilling,
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
      is: (email: string) => email.length > 0,
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
  pec: Yup.string()
    .email(INCORRECT_EMAIL_ADDRESS)
    .required(REQUIRED_FIELD),
  referents: Yup.array()
    .of(
      Yup.string()
        .min(4, "Deve essere al minimo di 4 caratteri")
        .max(20, "Deve essere al massimo di 20 caratteri")
        .required(REQUIRED_FIELD)
    )
    .required(REQUIRED_FIELD),
  insertedAt: Yup.string()
});
