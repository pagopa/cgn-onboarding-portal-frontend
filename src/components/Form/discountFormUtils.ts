import { AxiosError } from "axios";
import { format } from "date-fns";
import {
  ProductCategory,
  Discount,
  UpdateDiscount,
  BucketCodeLoadStatus
} from "../../api/generated";
import { TooltipContextProps, Severity } from "../../context/tooltip";
import {
  clearIfReferenceIsBlank,
  withNormalizedSpaces
} from "../../utils/strings";

export type DiscountFormValues = {
  id: string;
  name: string;
  name_en: string;
  name_de: string;
  description: string;
  description_en: string;
  description_de: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  discount: string;
  productCategories: Array<ProductCategory>;
  condition: string;
  condition_en: string;
  condition_de: string;
  staticCode: string;
  visibleOnEyca: boolean;
  eycaLandingPageUrl: string;
  discountUrl: string;
  lastBucketCodeLoadFileName: string;
  lastBucketCodeLoadUid: string;
  lastBucketCodeLoadStatus: BucketCodeLoadStatus | undefined;
  landingPageUrl: string;
  landingPageReferrer: string;
};

export const discountEmptyInitialValues: DiscountFormValues = {
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
  productCategories: [],
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
): DiscountFormValues {
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
    productCategories: discount.productCategories,
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
  values: DiscountFormValues
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
    discount: Number(values.discount),
    productCategories: values.productCategories.filter(pc =>
      productCategoriesList.includes(pc)
    ),
    condition: cleanedIfConditionIsBlank(values.condition),
    condition_en: cleanedIfConditionIsBlank(values.condition_en),
    condition_de: cleanedIfConditionIsBlank(values.condition_de),
    staticCode: values.staticCode,
    visibleOnEyca: values.visibleOnEyca,
    eycaLandingPageUrl: values.eycaLandingPageUrl,
    landingPageReferrer: values.landingPageReferrer,
    lastBucketCodeLoadUid: values.lastBucketCodeLoadUid,
    lastBucketCodeLoadFileName: values.lastBucketCodeLoadFileName,
    discountUrl: values.discountUrl
  };
}

export function updateDiscountMutationOnError({
  triggerTooltip
}: TooltipContextProps) {
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
