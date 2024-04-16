import { format } from "date-fns";
import { Button } from "design-react-kit";
import { Form, Formik } from "formik";
import { toError } from "fp-ts/lib/Either";
import { tryCatch } from "fp-ts/lib/TaskEither";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Api from "../../../api";
import { CreateDiscount, EntityType } from "../../../api/generated";
import { Severity, useTooltip } from "../../../context/tooltip";
import { DASHBOARD } from "../../../navigation/routes";
import { RootState } from "../../../store/store";
import chainAxios from "../../../utils/chainAxios";
import {
  withNormalizedSpaces,
  clearIfReferenceIsBlank
} from "../../../utils/strings";
import Bucket from "../CreateProfileForm/DiscountData/Bucket";
import DiscountConditions from "../CreateProfileForm/DiscountData/DiscountConditions";
import DiscountInfo from "../CreateProfileForm/DiscountData/DiscountInfo";
import DiscountUrl from "../CreateProfileForm/DiscountData/DiscountUrl";
import EnrollToEyca from "../CreateProfileForm/DiscountData/EnrollToEyca";
import LandingPage from "../CreateProfileForm/DiscountData/LandingPage";
import ProductCategories from "../CreateProfileForm/DiscountData/ProductCategories";
import StaticCode from "../CreateProfileForm/DiscountData/StaticCode";
import FormField from "../FormField";
import FormSection from "../FormSection";
import { discountDataValidationSchema } from "../ValidationSchemas";
import { MAX_SELECTABLE_CATEGORIES } from "../../../utils/constants";

const emptyInitialValues = {
  name: "",
  name_en: "",
  name_de: "-",
  description: "",
  description_en: "",
  description_de: "-",
  startDate: "",
  endDate: "",
  productCategories: [],
  condition: "",
  condition_en: "",
  condition_de: "-",
  staticCode: ""
};

/* eslint-disable sonarjs/cognitive-complexity */
const CreateDiscountForm = () => {
  const history = useHistory();
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>();
  const { triggerTooltip } = useTooltip();

  const throwErrorTooltip = () => {
    triggerTooltip({
      severity: Severity.DANGER,
      text:
        "Errore durante la creazione dell'opportunità, controllare i dati e riprovare"
    });
  };

  const checkStaticCode =
    (profile?.salesChannel?.channelType === "OnlineChannel" ||
      profile?.salesChannel?.channelType === "BothChannels") &&
    profile?.salesChannel?.discountCodeType === "Static";

  const checkLanding =
    (profile?.salesChannel?.channelType === "OnlineChannel" ||
      profile?.salesChannel?.channelType === "BothChannels") &&
    profile?.salesChannel?.discountCodeType === "LandingPage";

  const checkBucket =
    (profile?.salesChannel?.channelType === "OnlineChannel" ||
      profile?.salesChannel?.channelType === "BothChannels") &&
    profile?.salesChannel?.discountCodeType === "Bucket";

  const createDiscount = async (
    agreementId: string,
    discount: CreateDiscount
  ) =>
    await tryCatch(
      () => Api.Discount.createDiscount(agreementId, discount),
      toError
    )
      .chain(chainAxios)
      .map(response => response.data)
      .fold(throwErrorTooltip, () => history.push(DASHBOARD))
      .run();

  const getProfile = async (agreementId: string) =>
    await tryCatch(() => Api.Profile.getProfile(agreementId), toError)
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        profile => {
          setProfile({
            ...profile,
            hasDifferentFullName: !!profile.name
          });
          setLoading(false);
        }
      )
      .run();

  useEffect(() => {
    setLoading(true);
    void getProfile(agreement.id);
  }, []);

  const entityType = agreement.entityType;

  return (
    <Formik
      initialValues={emptyInitialValues}
      validationSchema={() =>
        discountDataValidationSchema(checkStaticCode, checkLanding, checkBucket)
      }
      onSubmit={values => {
        const cleanedIfDescriptionIsBlank = clearIfReferenceIsBlank(
          values.description
        );
        const cleanedIfConditionIsBlank = clearIfReferenceIsBlank(
          values.condition
        );
        const newValues = {
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
          startDate: format(new Date(values.startDate), "yyyy-MM-dd"),
          endDate: format(new Date(values.endDate), "yyyy-MM-dd")
        };
        void createDiscount(agreement.id, newValues);
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form autoComplete="off">
          <FormSection hasIntroduction>
            <DiscountInfo
              formValues={values}
              setFieldValue={setFieldValue}
              entityType={agreement.entityType}
            />
            <FormField
              htmlFor="productCategories"
              isTitleHeading
              title="Categorie merceologiche"
              description={(() => {
                switch (entityType) {
                  case EntityType.Private:
                    return `Seleziona al massimo ${MAX_SELECTABLE_CATEGORIES} categorie merceologiche a cui appatengono i beni/servizi oggetto dell'agevolazione`;
                  default:
                  case EntityType.PublicAdministration:
                    return `Seleziona al massimo ${MAX_SELECTABLE_CATEGORIES} categorie merceologiche a cui appatengono i beni/servizi oggetto dell'opportunità`;
                }
              })()}
              isVisible
              required
            >
              <ProductCategories
                selectedCategories={values.productCategories}
              />
            </FormField>
            <FormField
              htmlFor="discountConditions"
              isTitleHeading
              title={(() => {
                switch (entityType) {
                  case EntityType.Private:
                    return `Condizioni agevolazione`;
                  default:
                  case EntityType.PublicAdministration:
                    return `Condizioni dell’opportunità`;
                }
              })()}
              description={(() => {
                switch (entityType) {
                  case EntityType.Private:
                    return `Descrivere eventuali limitazioni relative all'agevolazione (es. sconto valido per l’acquisto di un solo abbonamento alla stagione di prosa presso gli sportelli del teatro) - Max 200 caratteri`;
                  default:
                  case EntityType.PublicAdministration:
                    return `Descrivere eventuali limitazioni relative all'opportunità (es. sconto valido per l’acquisto di un solo abbonamento alla stagione di prosa presso gli sportelli del teatro) - Max 200 caratteri`;
                }
              })()}
              isVisible
            >
              <DiscountConditions />
            </FormField>
            {!checkLanding && (
              <FormField
                htmlFor="discountUrl"
                title={(() => {
                  switch (entityType) {
                    case EntityType.Private:
                      return `Link all'agevolazione`;
                    default:
                    case EntityType.PublicAdministration:
                      return `Link all'opportunità`;
                  }
                })()}
                description={(() => {
                  switch (entityType) {
                    case EntityType.Private:
                      return `Inserire l’URL di destinazione del sito o dell’app da cui i titolari di CGN potranno accedere all'agevolazione`;
                    default:
                    case EntityType.PublicAdministration:
                      return `Inserire l’URL di destinazione del sito o dell’app da cui i titolari di CGN potranno accedere all'opportunità`;
                  }
                })()}
                isTitleHeading
                isVisible
              >
                <DiscountUrl />
              </FormField>
            )}
            {checkStaticCode && (
              <FormField
                htmlFor="staticCode"
                isTitleHeading
                title="Codice statico"
                description={(() => {
                  switch (entityType) {
                    case EntityType.Private:
                      return `Inserire il codice relativo all'agevolazione che l’utente dovrà inserire sul vostro portale online`;
                    default:
                    case EntityType.PublicAdministration:
                      return `Inserire il codice relativo all'opportunità che l’utente dovrà inserire sul vostro portale online`;
                  }
                })()}
                isVisible
                required
              >
                <StaticCode />
              </FormField>
            )}
            {checkLanding && (
              <FormField
                htmlFor="landingPage"
                isTitleHeading
                title="Indirizzo della landing page*"
                description={(() => {
                  switch (entityType) {
                    case EntityType.Private:
                      return `Inserire l’URL della landing page da cui i titolari di CGN potranno accedere all’agevolazione`;
                    default:
                    case EntityType.PublicAdministration:
                      return `Inserire l’URL della landing page da cui i titolari di CGN potranno accedere all’opportunità`;
                  }
                })()}
                isVisible
                required
              >
                <LandingPage />
              </FormField>
            )}
            {checkBucket && (
              <Bucket
                agreementId={agreement.id}
                label={"Seleziona un file dal computer"}
                formValues={values}
                setFieldValue={setFieldValue}
              />
            )}
            {(profile?.salesChannel?.channelType === "OnlineChannel" ||
              profile?.salesChannel?.channelType === "BothChannels") && (
              <EnrollToEyca
                isEycaSupported={checkStaticCode}
                discountOption={
                  checkLanding
                    ? "Landing Page"
                    : checkBucket
                    ? "Lista di codici statici"
                    : "API"
                }
                formValues={values}
                setFieldValue={setFieldValue}
              />
            )}
            <div className="mt-10">
              <Button
                className="px-14 mr-4"
                outline
                color="primary"
                tag="button"
                onClick={() => history.push(DASHBOARD)}
              >
                Indietro
              </Button>
              <Button
                type="submit"
                className="px-14 mr-4"
                color="primary"
                tag="button"
                aria-disabled={isSubmitting}
              >
                Salva
              </Button>
            </div>
          </FormSection>
        </Form>
      )}
    </Formik>
  );
};

export default CreateDiscountForm;
