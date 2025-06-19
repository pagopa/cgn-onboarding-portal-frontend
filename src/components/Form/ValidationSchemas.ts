import { z } from "zod";
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

const onlyStringRegex = /^[a-zA-Z\s]*$/;
const onlyNumberRegex = /^\d*$/;
const streetRegex = /^[A-Za-z0-9\s]*$/;
const zipCodeRegex = /^\d*$/;
const fiscalCodeRegex =
  /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/i; // NOSONAR: This is a secure regex to get an italian fiscal code

const ReferentValidationSchema = z.object({
  firstName: z
    .string()
    .regex(onlyStringRegex, ONLY_STRING)
    .min(1, REQUIRED_FIELD),
  lastName: z
    .string()
    .regex(onlyStringRegex, ONLY_STRING)
    .min(1, REQUIRED_FIELD),
  role: z.string().regex(onlyStringRegex, ONLY_STRING).min(1, REQUIRED_FIELD),
  emailAddress: z
    .string()
    .email(INCORRECT_EMAIL_ADDRESS)
    .min(1, REQUIRED_FIELD),
  telephoneNumber: z
    .string()
    .regex(onlyNumberRegex, ONLY_NUMBER)
    .min(4, "Inserisci un numero di telefono valido")
    .min(1, REQUIRED_FIELD)
});

export const ProfileDataValidationSchema = z
  .object({
    hasDifferentName: z.boolean().optional(),
    name: z.string().optional(),
    name_en: z.string().optional(),
    name_de: z.string().optional(),
    pecAddress: z
      .string()
      .email(INCORRECT_EMAIL_ADDRESS)
      .min(1, REQUIRED_FIELD),
    legalOffice: z.string().min(1, REQUIRED_FIELD),
    telephoneNumber: z
      .string()
      .regex(onlyNumberRegex, ONLY_NUMBER)
      .min(4, "Inserisci un numero di telefono valido")
      .min(1, REQUIRED_FIELD),
    legalRepresentativeFullName: z
      .string()
      .regex(onlyStringRegex, ONLY_STRING)
      .min(1, REQUIRED_FIELD),
    legalRepresentativeTaxCode: z
      .string()
      .min(4, "Inserisci un codice fiscale valido")
      .max(20, "Deve essere al massimo di 20 caratteri")
      .min(1, REQUIRED_FIELD),
    referent: ReferentValidationSchema,
    secondaryReferents: z
      .array(ReferentValidationSchema)
      .min(1, REQUIRED_FIELD),
    description: z.string().min(1, REQUIRED_FIELD),
    description_en: z.string().min(1, REQUIRED_FIELD),
    description_de: z.string().min(1, REQUIRED_FIELD),
    salesChannel: z.object({
      channelType: z.enum(["OnlineChannel", "OfflineChannel", "BothChannels"]),
      websiteUrl: z.string().url(INCORRECT_WEBSITE_URL).optional().nullable(),
      discountCodeType: z.string().optional(),
      allNationalAddresses: z.boolean(),
      addresses: z
        .array(
          z.object({
            street: z
              .string()
              .regex(streetRegex, "Solo lettere o numeri")
              .min(1, REQUIRED_FIELD),
            zipCode: z
              .string()
              .regex(zipCodeRegex, ONLY_NUMBER)
              .min(5, "Deve essere di 5 caratteri")
              .max(5, "Deve essere di 5 caratteri")
              .min(1, REQUIRED_FIELD),
            city: z.string().min(1, REQUIRED_FIELD),
            district: z.string().min(1, REQUIRED_FIELD),
            coordinates: z.object({
              latitude: z.string().optional(),
              longitude: z.string().optional()
            }),
            label: z.string().optional(),
            value: z.string().optional()
          })
        )
        .optional()
    })
  })
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((data, ctx) => {
    if (data.hasDifferentName) {
      if (!data.name) {
        ctx.addIssue({
          path: ["name"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_FIELD
        });
      }
      if (!data.name_en) {
        ctx.addIssue({
          path: ["name_en"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_FIELD
        });
      }
      if (!data.name_de) {
        ctx.addIssue({
          path: ["name_de"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_FIELD
        });
      }
    }
    const channelType = data.salesChannel.channelType;
    if (channelType === "OnlineChannel" || channelType === "BothChannels") {
      if (!data.salesChannel.websiteUrl) {
        ctx.addIssue({
          path: ["salesChannel", "websiteUrl"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_FIELD
        });
      }
      if (!data.salesChannel.discountCodeType) {
        ctx.addIssue({
          path: ["salesChannel", "discountCodeType"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_FIELD
        });
      }
    }
    if (
      (channelType === SalesChannelType.OfflineChannel ||
        channelType === SalesChannelType.BothChannels) &&
      !data.salesChannel.allNationalAddresses
    ) {
      if (
        !data.salesChannel.addresses ||
        data.salesChannel.addresses.length === 0
      ) {
        ctx.addIssue({
          path: ["salesChannel", "addresses"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_FIELD
        });
      }
    }
  });

const checkEycaLandingDifferentFromLandingPageUrl = (
  eycaLandingPageUrl: string | undefined,
  landingPageUrl: string | undefined
) =>
  !(
    eycaLandingPageUrl &&
    landingPageUrl &&
    eycaLandingPageUrl === landingPageUrl
  );

export const discountDataValidationSchema = (
  staticCheck: boolean,
  landingCheck: boolean,
  bucketCheck: boolean
) =>
  z
    .object({
      name: z.string().max(100).min(1, REQUIRED_FIELD),
      name_en: z.string().max(100).min(1, REQUIRED_FIELD),
      name_de: z.string().max(100).min(1, REQUIRED_FIELD),
      description: z.string().max(250).optional(),
      description_en: z.string().max(250).optional(),
      description_de: z.string().max(250).optional(),
      discountUrl: z.string().url(INCORRECT_WEBSITE_URL).optional(),
      startDate: z.string().min(1, REQUIRED_FIELD),
      endDate: z.string().min(1, REQUIRED_FIELD),
      discount: z
        .number()
        .int(DISCOUNT_RANGE)
        .min(1, DISCOUNT_RANGE)
        .max(100, DISCOUNT_RANGE)
        .optional(),
      productCategories: z
        .array(z.any())
        .min(1, PRODUCT_CATEGORIES_ONE)
        .max(MAX_SELECTABLE_CATEGORIES, PRODUCT_CATEGORIES_MAX),
      condition: z.string().optional(),
      condition_en: z.string().optional(),
      condition_de: z.string().optional(),
      staticCode: z.string().optional(),
      landingPageUrl: z.string().url(INCORRECT_WEBSITE_URL).optional(),
      landingPageReferrer: z.string().optional(),
      lastBucketCodeLoadUid: z.string().optional(),
      lastBucketCodeLoadFileName: z.string().optional(),
      visibleOnEyca: z.boolean().optional(),
      eycaLandingPageUrl: z
        .string()
        .url(INCORRECT_WEBSITE_URL)
        .optional()
        .nullable()
    })
    // eslint-disable-next-line complexity, sonarjs/cognitive-complexity
    .superRefine((data, ctx) => {
      // Description/condition required if their translations are present
      if (data.description_en && !data.description) {
        ctx.addIssue({
          path: ["description"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_FIELD
        });
      }
      if (data.description && !data.description_en) {
        ctx.addIssue({
          path: ["description_en"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_FIELD
        });
      }
      if (data.description && !data.description_de) {
        ctx.addIssue({
          path: ["description_de"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_FIELD
        });
      }
      if (data.condition_en && !data.condition) {
        ctx.addIssue({
          path: ["condition"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_FIELD
        });
      }
      if (data.condition && !data.condition_en) {
        ctx.addIssue({
          path: ["condition_en"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_FIELD
        });
      }
      if (data.condition && !data.condition_de) {
        ctx.addIssue({
          path: ["condition_de"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_FIELD
        });
      }
      if (staticCheck && !data.staticCode) {
        ctx.addIssue({
          path: ["staticCode"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_FIELD
        });
      }
      if (landingCheck) {
        if (!data.landingPageUrl) {
          ctx.addIssue({
            path: ["landingPageUrl"],
            code: z.ZodIssueCode.custom,
            message: REQUIRED_FIELD
          });
        }
        if (!data.landingPageReferrer) {
          ctx.addIssue({
            path: ["landingPageReferrer"],
            code: z.ZodIssueCode.custom,
            message: REQUIRED_FIELD
          });
        }
      }
      if (bucketCheck) {
        if (!data.lastBucketCodeLoadUid) {
          ctx.addIssue({
            path: ["lastBucketCodeLoadUid"],
            code: z.ZodIssueCode.custom,
            message: REQUIRED_FIELD
          });
        }
        if (!data.lastBucketCodeLoadFileName) {
          ctx.addIssue({
            path: ["lastBucketCodeLoadFileName"],
            code: z.ZodIssueCode.custom,
            message: REQUIRED_FIELD
          });
        }
      }
      if (data.visibleOnEyca && landingCheck) {
        if (!data.eycaLandingPageUrl) {
          ctx.addIssue({
            path: ["eycaLandingPageUrl"],
            code: z.ZodIssueCode.custom,
            message: REQUIRED_FIELD
          });
        }
        if (
          !checkEycaLandingDifferentFromLandingPageUrl(
            data.eycaLandingPageUrl ?? undefined,
            data.landingPageUrl ?? undefined
          )
        ) {
          ctx.addIssue({
            path: ["eycaLandingPageUrl"],
            code: z.ZodIssueCode.custom,
            message:
              "L'url della EYCA non può essere uguale all'url della landing page"
          });
        }
      }
    });

export const discountsListDataValidationSchema = (
  staticCheck: boolean,
  landingCheck: boolean,
  bucketCheck: boolean
) =>
  z.object({
    discounts: z.array(
      discountDataValidationSchema(staticCheck, landingCheck, bucketCheck)
    )
  });

const helpCategoryEnum = z.nativeEnum(HelpRequestCategoryEnum);

export const loggedHelpValidationSchema = z
  .object({
    category: helpCategoryEnum,
    topic: z.string().optional(),
    message: z.string().min(1, REQUIRED_FIELD)
  })
  .superRefine((data, ctx) => {
    if (
      data.category === HelpRequestCategoryEnum.Discounts ||
      data.category === HelpRequestCategoryEnum.Documents ||
      data.category === HelpRequestCategoryEnum.DataFilling
    ) {
      if (!data.topic) {
        ctx.addIssue({
          path: ["topic"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_FIELD
        });
      }
    }
  });

export const notLoggedHelpValidationSchema = z
  .object({
    category: helpCategoryEnum,
    topic: z.string().optional(),
    message: z.string().min(1, REQUIRED_FIELD),
    referentFirstName: z
      .string()
      .regex(onlyStringRegex, ONLY_STRING)
      .min(1, REQUIRED_FIELD),
    referentLastName: z
      .string()
      .regex(onlyStringRegex, ONLY_STRING)
      .min(1, REQUIRED_FIELD),
    legalName: z
      .string()
      .regex(onlyStringRegex, ONLY_STRING)
      .min(1, REQUIRED_FIELD),
    emailAddress: z
      .string()
      .email(INCORRECT_EMAIL_ADDRESS)
      .min(1, REQUIRED_FIELD),
    confirmEmailAddress: z.string().email(INCORRECT_EMAIL_ADDRESS).optional(),
    recaptchaToken: z.string().min(1, REQUIRED_FIELD)
  })
  .superRefine((data, ctx) => {
    if (
      data.category === HelpRequestCategoryEnum.Discounts ||
      data.category === HelpRequestCategoryEnum.Documents ||
      data.category === HelpRequestCategoryEnum.DataFilling
    ) {
      if (!data.topic) {
        ctx.addIssue({
          path: ["topic"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_FIELD
        });
      }
    }
    if (data.emailAddress && data.confirmEmailAddress) {
      if (data.emailAddress !== data.confirmEmailAddress) {
        ctx.addIssue({
          path: ["confirmEmailAddress"],
          code: z.ZodIssueCode.custom,
          message: INCORRECT_CONFIRM_EMAIL_ADDRESS
        });
      }
    }
  });

export const activationValidationSchema = z.object({
  keyOrganizationFiscalCode: z.string().optional(),
  organizationFiscalCode: z.string().min(1, REQUIRED_FIELD),
  organizationName: z.string().min(1, REQUIRED_FIELD),
  pec: z.string().email(INCORRECT_EMAIL_ADDRESS).min(1, REQUIRED_FIELD),
  referents: z
    .array(
      z
        .string()
        .min(4, "Deve essere al minimo di 4 caratteri")
        .max(20, "Deve essere al massimo di 20 caratteri")
        .regex(fiscalCodeRegex, "Il codice fiscale inserito non è corretto")
        .min(1, REQUIRED_FIELD)
    )
    .min(1, REQUIRED_FIELD),
  insertedAt: z.string().optional(),
  entityType: z.nativeEnum(EntityType)
});
