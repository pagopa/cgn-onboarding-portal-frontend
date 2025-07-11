import { z } from "zod/v4";
import {
  HelpRequestCategoryEnum,
  ProductCategory,
  SalesChannelType
} from "../../api/generated";
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

const onlyAlphaRegex = /^[a-zA-Z\s]*$/;
const onlyNumberRegex = /^\d*$/;
const streetRegex = /^[A-Za-z0-9\s]*$/;
const zipCodeRegex = /^\d*$/;
const fiscalCodeRegex =
  /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/i; // NOSONAR: This is a secure regex to get an italian fiscal code

const undefinedRequired = () => REQUIRED_FIELD;

const emptyAddress = z.object({
  street: z.literal(""),
  zipCode: z.literal(""),
  city: z.literal(""),
  district: z.literal(""),
  coordinates: z.object({
    latitude: z.literal(""),
    longitude: z.literal("")
  })
});

const optionalAddress = z.object({
  street: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  coordinates: z
    .object({
      latitude: z.string().optional(),
      longitude: z.string().optional()
    })
    .optional()
});

const requiredAddress = z.object({
  street: z
    .string({ error: undefinedRequired })
    .trim()
    .regex(streetRegex, "Solo lettere o numeri")
    .min(1, REQUIRED_FIELD),
  zipCode: z
    .string({ error: undefinedRequired })
    .trim()
    .regex(zipCodeRegex, ONLY_NUMBER)
    .min(5, "Deve essere di 5 caratteri")
    .max(5, "Deve essere di 5 caratteri")
    .min(1, REQUIRED_FIELD),
  city: z.string({ error: undefinedRequired }).trim().min(1, REQUIRED_FIELD),
  district: z
    .string({ error: undefinedRequired })
    .trim()
    .min(1, REQUIRED_FIELD),
  coordinates: z
    .object({
      latitude: z.string().optional(),
      longitude: z.string().optional()
    })
    .optional(),
  label: z.string().optional(),
  value: z.string().optional()
});

export const EmptyAddresses = z.array(emptyAddress);

export type EmptyAddresses = z.infer<typeof EmptyAddresses>;

const ReferentValidationSchema = z.object({
  firstName: z
    .string({ error: undefinedRequired })
    .trim()
    .regex(onlyAlphaRegex, ONLY_STRING)
    .min(1, REQUIRED_FIELD),
  lastName: z
    .string({ error: undefinedRequired })
    .trim()
    .regex(onlyAlphaRegex, ONLY_STRING)
    .min(1, REQUIRED_FIELD),
  role: z
    .string({ error: undefinedRequired })
    .regex(onlyAlphaRegex, ONLY_STRING)
    .min(1, REQUIRED_FIELD),
  emailAddress: z.email(INCORRECT_EMAIL_ADDRESS).min(1, REQUIRED_FIELD),
  telephoneNumber: z
    .string({ error: undefinedRequired })
    .trim()
    .regex(onlyNumberRegex, ONLY_NUMBER)
    .min(4, "Inserisci un numero di telefono valido")
    .min(1, REQUIRED_FIELD)
});

export const ProfileDataValidationSchema = z
  .object({
    hasDifferentName: z.boolean().optional(),
    name: z.string().trim().optional(),
    name_en: z.string().trim().optional(),
    name_de: z.string().trim().optional(),
    pecAddress: z.email(INCORRECT_EMAIL_ADDRESS).min(1, REQUIRED_FIELD),
    legalOffice: z
      .string({ error: undefinedRequired })
      .trim()
      .min(1, REQUIRED_FIELD),
    telephoneNumber: z
      .string({ error: undefinedRequired })
      .trim()
      .regex(onlyNumberRegex, ONLY_NUMBER)
      .min(4, "Inserisci un numero di telefono valido")
      .min(1, REQUIRED_FIELD),
    legalRepresentativeFullName: z
      .string({ error: undefinedRequired })
      .trim()
      .regex(onlyAlphaRegex, ONLY_STRING)
      .min(1, REQUIRED_FIELD),
    legalRepresentativeTaxCode: z
      .string({ error: undefinedRequired })
      .trim()
      .min(4, "Inserisci un codice fiscale valido")
      .max(20, "Deve essere al massimo di 20 caratteri")
      .min(1, REQUIRED_FIELD),
    referent: ReferentValidationSchema,
    secondaryReferents: z.array(ReferentValidationSchema),
    description: z
      .string({ error: undefinedRequired })
      .trim()
      .min(1, REQUIRED_FIELD),
    description_en: z
      .string({ error: undefinedRequired })
      .trim()
      .min(1, REQUIRED_FIELD),
    description_de: z
      .string({ error: undefinedRequired })
      .trim()
      .min(1, REQUIRED_FIELD),
    salesChannel: z.object({
      channelType: z.enum(["OnlineChannel", "OfflineChannel", "BothChannels"]),
      websiteUrl: z.url(INCORRECT_WEBSITE_URL).optional().nullable(),
      discountCodeType: z.string().optional(),
      allNationalAddresses: z.boolean(),
      addresses: z.array(optionalAddress).optional()
    })
  })

  .check(ctx => {
    if (ctx.value.hasDifferentName) {
      if (!ctx.value.name) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["name"],
          code: "custom",
          input: ctx.value.name,
          message: REQUIRED_FIELD
        });
      }
      if (!ctx.value.name_en) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["name_en"],
          code: "custom",
          input: ctx.value.name_en,
          message: REQUIRED_FIELD
        });
      }
      if (!ctx.value.name_de) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["name_de"],
          code: "custom",
          input: ctx.value.name_de,
          message: REQUIRED_FIELD
        });
      }
    }
    const channelType = ctx.value.salesChannel.channelType;
    if (channelType === "OnlineChannel" || channelType === "BothChannels") {
      if (!ctx.value.salesChannel.websiteUrl) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["salesChannel", "websiteUrl"],
          code: "custom",
          input: ctx.value.salesChannel.websiteUrl,
          message: REQUIRED_FIELD
        });
      }
      if (!ctx.value.salesChannel.discountCodeType) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["salesChannel", "discountCodeType"],
          code: "custom",
          input: ctx.value.salesChannel.discountCodeType,
          message: REQUIRED_FIELD
        });
      }
    }
    if (
      (channelType === SalesChannelType.OfflineChannel ||
        channelType === SalesChannelType.BothChannels) &&
      !ctx.value.salesChannel.allNationalAddresses
    ) {
      z.array(requiredAddress)
        .min(1, REQUIRED_FIELD)
        .safeParse(ctx.value.salesChannel.addresses)
        .error?.issues.forEach(issue => {
          // eslint-disable-next-line functional/immutable-data
          ctx.issues.push({
            ...issue,
            path: ["salesChannel", "addresses", ...issue.path]
          });
        });
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
      name: z
        .string({ error: undefinedRequired })
        .trim()
        .max(100)
        .min(1, REQUIRED_FIELD),
      name_en: z
        .string({ error: undefinedRequired })
        .trim()
        .max(100)
        .min(1, REQUIRED_FIELD),
      name_de: z
        .string({ error: undefinedRequired })
        .trim()
        .max(100)
        .min(1, REQUIRED_FIELD),
      description: z.string().max(250).optional(),
      description_en: z.string().max(250).optional(),
      description_de: z.string().max(250).optional(),
      discountUrl: z.url(INCORRECT_WEBSITE_URL).optional(),
      startDate: z.date({ error: undefinedRequired }),
      endDate: z.date({ error: undefinedRequired }),
      discount: z.coerce
        .number(DISCOUNT_RANGE)
        .int(DISCOUNT_RANGE)
        .min(1, DISCOUNT_RANGE)
        .max(100, DISCOUNT_RANGE)
        .optional(),
      productCategories: z
        .array(z.enum(ProductCategory, "Categoria merceologica non valida"))
        .min(1, PRODUCT_CATEGORIES_ONE)
        .max(MAX_SELECTABLE_CATEGORIES, PRODUCT_CATEGORIES_MAX),
      condition: z.string().optional(),
      condition_en: z.string().optional(),
      condition_de: z.string().optional(),
      staticCode: z.string().optional(),
      landingPageUrl: z.url(INCORRECT_WEBSITE_URL).optional(),
      landingPageReferrer: z.string().optional(),
      lastBucketCodeLoadUid: z.string().optional(),
      lastBucketCodeLoadFileName: z.string().optional(),
      visibleOnEyca: z.boolean().optional(),
      eycaLandingPageUrl: z.url(INCORRECT_WEBSITE_URL).optional().nullable()
    })
    // eslint-disable-next-line complexity, sonarjs/cognitive-complexity
    .check(ctx => {
      // Description/condition required if their translations are present
      if (ctx.value.description_en && !ctx.value.description) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["description"],
          code: "custom",
          input: ctx.value.description,
          message: REQUIRED_FIELD
        });
      }
      if (ctx.value.description && !ctx.value.description_en) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["description_en"],
          code: "custom",
          input: ctx.value.description_en,
          message: REQUIRED_FIELD
        });
      }
      if (ctx.value.description && !ctx.value.description_de) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["description_de"],
          code: "custom",
          input: ctx.value.description_de,
          message: REQUIRED_FIELD
        });
      }
      if (ctx.value.condition_en && !ctx.value.condition) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["condition"],
          code: "custom",
          input: ctx.value.condition,
          message: REQUIRED_FIELD
        });
      }
      if (ctx.value.condition && !ctx.value.condition_en) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["condition_en"],
          code: "custom",
          input: ctx.value.condition_en,
          message: REQUIRED_FIELD
        });
      }
      if (ctx.value.condition && !ctx.value.condition_de) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["condition_de"],
          code: "custom",
          input: ctx.value.condition_de,
          message: REQUIRED_FIELD
        });
      }
      if (staticCheck && !ctx.value.staticCode) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["staticCode"],
          code: "custom",
          input: ctx.value.staticCode,
          message: REQUIRED_FIELD
        });
      }
      if (landingCheck) {
        if (!ctx.value.landingPageUrl) {
          // eslint-disable-next-line functional/immutable-data
          ctx.issues.push({
            path: ["landingPageUrl"],
            code: "custom",
            input: ctx.value.landingPageUrl,
            message: REQUIRED_FIELD
          });
        }
        if (!ctx.value.landingPageReferrer) {
          // eslint-disable-next-line functional/immutable-data
          ctx.issues.push({
            path: ["landingPageReferrer"],
            code: "custom",
            input: ctx.value.landingPageReferrer,
            message: REQUIRED_FIELD
          });
        }
      }
      if (bucketCheck) {
        if (!ctx.value.lastBucketCodeLoadUid) {
          // eslint-disable-next-line functional/immutable-data
          ctx.issues.push({
            path: ["lastBucketCodeLoadUid"],
            code: "custom",
            input: ctx.value.lastBucketCodeLoadUid,
            message: REQUIRED_FIELD
          });
        }
        if (!ctx.value.lastBucketCodeLoadFileName) {
          // eslint-disable-next-line functional/immutable-data
          ctx.issues.push({
            path: ["lastBucketCodeLoadFileName"],
            code: "custom",
            input: ctx.value.lastBucketCodeLoadFileName,
            message: REQUIRED_FIELD
          });
        }
      }
      if (ctx.value.visibleOnEyca && landingCheck) {
        if (!ctx.value.eycaLandingPageUrl) {
          // eslint-disable-next-line functional/immutable-data
          ctx.issues.push({
            path: ["eycaLandingPageUrl"],
            code: "custom",
            input: ctx.value.eycaLandingPageUrl,
            message: REQUIRED_FIELD
          });
        }
        if (
          !checkEycaLandingDifferentFromLandingPageUrl(
            ctx.value.eycaLandingPageUrl ?? undefined,
            ctx.value.landingPageUrl ?? undefined
          )
        ) {
          // eslint-disable-next-line functional/immutable-data
          ctx.issues.push({
            path: ["eycaLandingPageUrl"],
            code: "custom",
            input: ctx.value.eycaLandingPageUrl,
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

const helpCategoryEnum = z.enum(HelpRequestCategoryEnum);

function helpTopicValidation(
  ctx: z.core.ParsePayload<{
    category: HelpRequestCategoryEnum;
    topic?: string;
  }>
) {
  if (
    ctx.value.category === HelpRequestCategoryEnum.Discounts ||
    ctx.value.category === HelpRequestCategoryEnum.Documents ||
    ctx.value.category === HelpRequestCategoryEnum.DataFilling
  ) {
    if (!ctx.value.topic) {
      // eslint-disable-next-line functional/immutable-data
      ctx.issues.push({
        path: ["topic"],
        code: "custom",
        input: ctx.value.topic,
        message: REQUIRED_FIELD
      });
    }
  }
}

export const loggedHelpValidationSchema = z
  .object({
    category: helpCategoryEnum,
    topic: z.string().optional(),
    message: z
      .string({ error: undefinedRequired })
      .trim()
      .min(1, REQUIRED_FIELD)
  })
  .check(ctx => {
    helpTopicValidation(ctx);
  });

export const notLoggedHelpValidationSchema = z
  .object({
    category: helpCategoryEnum,
    topic: z.string().optional(),
    message: z
      .string({ error: undefinedRequired })
      .trim()
      .min(1, REQUIRED_FIELD),
    referentFirstName: z
      .string({ error: undefinedRequired })
      .trim()
      .regex(onlyAlphaRegex, ONLY_STRING)
      .min(1, REQUIRED_FIELD),
    referentLastName: z
      .string({ error: undefinedRequired })
      .trim()
      .regex(onlyAlphaRegex, ONLY_STRING)
      .min(1, REQUIRED_FIELD),
    legalName: z
      .string({ error: undefinedRequired })
      .trim()
      .regex(onlyAlphaRegex, ONLY_STRING)
      .min(1, REQUIRED_FIELD),
    emailAddress: z.email(INCORRECT_EMAIL_ADDRESS).min(1, REQUIRED_FIELD),
    confirmEmailAddress: z.email(INCORRECT_EMAIL_ADDRESS).optional(),
    recaptchaToken: z
      .string({ error: undefinedRequired })
      .trim()
      .min(1, REQUIRED_FIELD)
  })
  .check(ctx => {
    helpTopicValidation(ctx);
    if (ctx.value.emailAddress && ctx.value.confirmEmailAddress) {
      if (ctx.value.emailAddress !== ctx.value.confirmEmailAddress) {
        // eslint-disable-next-line functional/immutable-data
        ctx.issues.push({
          path: ["confirmEmailAddress"],
          code: "custom",
          input: ctx.value.confirmEmailAddress,
          message: INCORRECT_CONFIRM_EMAIL_ADDRESS
        });
      }
    }
  });

export const activationValidationSchema = z.object({
  keyOrganizationFiscalCode: z.string().optional(),
  organizationFiscalCode: z
    .string({ error: undefinedRequired })
    .trim()
    .min(1, REQUIRED_FIELD),
  organizationName: z
    .string({ error: undefinedRequired })
    .trim()
    .min(1, REQUIRED_FIELD),
  pec: z.email(INCORRECT_EMAIL_ADDRESS).min(1, REQUIRED_FIELD),
  referents: z
    .array(
      z
        .string({ error: undefinedRequired })
        .trim()
        .min(4, "Deve essere al minimo di 4 caratteri")
        .max(20, "Deve essere al massimo di 20 caratteri")
        .regex(fiscalCodeRegex, "Il codice fiscale inserito non è corretto")
        .min(1, REQUIRED_FIELD)
    )
    .min(1, REQUIRED_FIELD),
  insertedAt: z.string().optional(),
  entityType: z.enum(EntityType)
});
