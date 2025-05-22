import { AxiosError } from "axios";
import { format } from "date-fns";
import { ProductCategory } from "../../api/generated";
import { TooltipContextProps, Severity } from "../../context/tooltip";
import {
  clearIfReferenceIsBlank,
  withNormalizedSpaces
} from "../../utils/strings";

export const discountEmptyInitialValues = {
  name: "",
  name_en: "",
  name_de: "-",
  description: "",
  description_en: "",
  description_de: "-",
  startDate: "",
  endDate: "",
  discount: "",
  productCategories: [],
  condition: "",
  condition_en: "",
  condition_de: "-",
  staticCode: "",
  visibleOnEyca: false,
  eycaLandingPageUrl: undefined,
  discountUrl: "",
  lastBucketCodeLoadFileName: undefined,
  lastBucketCodeLoadUid: undefined,
  landingPageUrl: "",
  landingPageReferrer: ""
};

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

export function sanitizeDiscountFormValues(values: any) {
  const cleanedIfDescriptionIsBlank = clearIfReferenceIsBlank(
    values.description
  );
  const cleanedIfConditionIsBlank = clearIfReferenceIsBlank(values.condition);
  return {
    ...values,
    name: withNormalizedSpaces(values.name),
    name_en: withNormalizedSpaces(values.name_en),
    name_de: "-",
    description: cleanedIfDescriptionIsBlank(values.description),
    description_en: cleanedIfDescriptionIsBlank(values.description_en),
    description_de: cleanedIfDescriptionIsBlank(values.description_de),
    condition: cleanedIfConditionIsBlank(values.condition),
    condition_en: cleanedIfConditionIsBlank(values.condition_en),
    condition_de: cleanedIfConditionIsBlank(values.condition_de),
    productCategories: values.productCategories.filter((pc: any) =>
      Object.values(ProductCategory).includes(pc)
    ),
    startDate: format(new Date(values.startDate), "yyyy-MM-dd"),
    endDate: format(new Date(values.endDate), "yyyy-MM-dd")
  };
}
