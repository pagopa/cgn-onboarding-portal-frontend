import { AxiosError } from "axios";
import * as z from "zod/mini";
import { format } from "date-fns";
import { ProductCategory, Discount, UpdateDiscount } from "../../api/generated";
import { TooltipContextProps, Severity } from "../../context/tooltip";
import {
  clearIfReferenceIsBlank,
  withNormalizedSpaces
} from "../../utils/strings";
import { discountDataValidationSchema } from "./ValidationSchemas";

export type DiscountFormInputValues = z.input<
  ReturnType<typeof discountDataValidationSchema>
>;

type DiscountFormOutputValues = z.output<
  ReturnType<typeof discountDataValidationSchema>
>;

export const discountEmptyInitialValues: DiscountFormInputValues = {
  id: "",
  name: "",
  name_en: "",
  name_de: "-",
  description: "",
  description_en: "",
  description_de: "-",
  startDate: undefined,
  endDate: undefined,
  discount: "",
  productCategories: {} as Record<ProductCategory, boolean>,
  condition: "",
  condition_en: "",
  condition_de: "-",
  staticCode: "",
  visibleOnEyca: false,
  eycaLandingPageUrl: "",
  discountUrl: "",
  lastBucketCodeLoadFileName: "",
  lastBucketCodeLoadUid: "",
  lastBucketCodeLoadStatus: undefined,
  landingPageUrl: "",
  landingPageReferrer: ""
};

export function discountToFormValues(
  discount: Discount | undefined
): DiscountFormInputValues {
  if (!discount) {
    return discountEmptyInitialValues;
  }
  const cleanedIfDescriptionIsBlank = clearIfReferenceIsBlank(
    discount.description
  );
  const cleanedIfConditionIsBlank = clearIfReferenceIsBlank(discount.condition);
  return {
    id: discount.id,
    name: withNormalizedSpaces(discount.name),
    name_en: withNormalizedSpaces(discount.name_en),
    name_de: "-",
    description: cleanedIfDescriptionIsBlank(discount.description),
    description_en: cleanedIfDescriptionIsBlank(discount.description_en),
    description_de: "-",
    startDate: new Date(discount.startDate),
    endDate: new Date(discount.endDate),
    discount: discount.discount ? String(discount.discount) : "",
    productCategories: Object.fromEntries(
      discount.productCategories.map(category => [category, true])
    ) as Record<ProductCategory, boolean>,
    condition: cleanedIfConditionIsBlank(discount.condition),
    condition_en: cleanedIfConditionIsBlank(discount.condition_en),
    condition_de: "-",
    staticCode: discount.staticCode ?? "",
    visibleOnEyca: discount.visibleOnEyca ?? false,
    eycaLandingPageUrl: discount.eycaLandingPageUrl ?? "",
    discountUrl: discount.discountUrl ?? "",
    lastBucketCodeLoadUid: discount.lastBucketCodeLoadUid ?? "",
    lastBucketCodeLoadFileName: discount.lastBucketCodeLoadFileName ?? "",
    lastBucketCodeLoadStatus: undefined,
    landingPageUrl: discount.landingPageUrl ?? "",
    landingPageReferrer: discount.landingPageReferrer ?? ""
  };
}

export function discountFormValuesToRequest(
  values: DiscountFormOutputValues
): UpdateDiscount {
  const cleanedIfDescriptionIsBlank = clearIfReferenceIsBlank(
    values.description
  );
  const cleanedIfConditionIsBlank = clearIfReferenceIsBlank(values.condition);
  const productCategoriesList = Object.values(ProductCategory);
  return {
    name: withNormalizedSpaces(values.name),
    name_en: withNormalizedSpaces(values.name_en),
    name_de: "-",
    description: cleanedIfDescriptionIsBlank(values.description),
    description_en: cleanedIfDescriptionIsBlank(values.description_en),
    description_de: cleanedIfDescriptionIsBlank(values.description_de),
    startDate: format(values.startDate!, "yyyy-MM-dd"),
    endDate: format(values.endDate!, "yyyy-MM-dd"),
    discount: Number(values.discount) || undefined,
    productCategories: values.productCategories.filter(pc =>
      productCategoriesList.includes(pc)
    ),
    condition: cleanedIfConditionIsBlank(values.condition),
    condition_en: cleanedIfConditionIsBlank(values.condition_en),
    condition_de: cleanedIfConditionIsBlank(values.condition_de),
    staticCode: values.staticCode,
    visibleOnEyca: values.visibleOnEyca,
    eycaLandingPageUrl: values.eycaLandingPageUrl,
    landingPageUrl: values.landingPageUrl,
    landingPageReferrer: values.landingPageReferrer,
    lastBucketCodeLoadUid: values.lastBucketCodeLoadUid,
    lastBucketCodeLoadFileName: values.lastBucketCodeLoadFileName,
    discountUrl: values.discountUrl
  };
}

export function createDiscountMutationOnError(
  triggerTooltip: TooltipContextProps["triggerTooltip"]
) {
  return (error: AxiosError<unknown, unknown>) => {
    if (error.status === 409) {
      triggerTooltip({
        severity: Severity.DANGER,
        text: "Upload codici ancora in corso"
      });
    } else {
      triggerTooltip({
        severity: Severity.DANGER,
        text: "Errore durante la creazione dell'opportunità, controllare i dati e riprovare"
      });
    }
  };
}

export function updateDiscountMutationOnError(
  triggerTooltip: TooltipContextProps["triggerTooltip"]
) {
  return (error: AxiosError<unknown, unknown>) => {
    if (error.status === 409) {
      triggerTooltip({
        severity: Severity.DANGER,
        text: "Upload codici ancora in corso"
      });
    } else if (
      error.status === 400 &&
      error.response?.data ===
        "CANNOT_UPDATE_DISCOUNT_BUCKET_WHILE_PROCESSING_IS_RUNNING"
    ) {
      triggerTooltip({
        severity: Severity.DANGER,
        text: "È già in corso il caricamento di una lista di codici. Attendi il completamento e riprova."
      });
    } else {
      triggerTooltip({
        severity: Severity.DANGER,
        text: "Errore durante la modifica dell'opportunità, controllare i dati e riprovare"
      });
    }
  };
}
