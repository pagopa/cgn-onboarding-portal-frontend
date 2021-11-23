import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import { Button } from "design-react-kit";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { format } from "date-fns";
import { useHistory, useParams } from "react-router-dom";
import Api from "../../../api";
import CenteredLoading from "../../CenteredLoading/CenteredLoading";
import DiscountInfo from "../CreateProfileForm/DiscountData/DiscountInfo";
import ProductCategories from "../CreateProfileForm/DiscountData/ProductCategories";
import DiscountConditions from "../CreateProfileForm/DiscountData/DiscountConditions";
import StaticCode from "../CreateProfileForm/DiscountData/StaticCode";
import { RootState } from "../../../store/store";
import FormSection from "../FormSection";
import FormField from "../FormField";
import { Discount } from "../../../api/generated";
import { DASHBOARD } from "../../../navigation/routes";
import { discountDataValidationSchema } from "../ValidationSchemas";
import PublishModal from "../../Discounts/PublishModal";
import LandingPage from "../CreateProfileForm/DiscountData/LandingPage";

const emptyInitialValues = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  discount: "",
  productCategories: [],
  condition: "",
  staticCode: ""
};

const EditDiscountForm = () => {
  const { discountId } = useParams<any>();
  const history = useHistory();
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [initialValues, setInitialValues] = useState<any>(emptyInitialValues);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>();
  const [publishModal, setPublishModal] = useState(false);
  const togglePublishModal = () => setPublishModal(!publishModal);
  const [selectedPublish, setSelectedPublish] = useState<any>();

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

  const updateDiscount = async (agreementId: string, discount: Discount) => {
    const {
      id,
      agreementId: agId,
      state,
      creationDate,
      ...updatedDiscount
    } = discount;
    await tryCatch(
      () =>
        Api.Discount.updateDiscount(agreementId, discountId, updatedDiscount),
      toError
    )
      .map(response => response.data)
      .fold(
        () => void 0,
        () => history.push(DASHBOARD)
      )
      .run();
  };

  const getDiscount = async (agreementId: string) =>
    await tryCatch(
      () => Api.Discount.getDiscountById(agreementId, discountId),
      toError
    )
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        discount => {
          setInitialValues({
            ...discount,
            startDate: new Date(discount.startDate),
            endDate: new Date(discount.endDate)
          });
          setLoading(false);
        }
      )
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

  const publishDiscount = async (discountId: string) =>
    await tryCatch(
      () => Api.Discount.publishDiscount(agreement.id, discountId),
      toError
    )
      .fold(
        () => void 0,
        () => void 0
      )
      .run();

  useEffect(() => {
    setLoading(true);
    void getDiscount(agreement.id);
    void getProfile(agreement.id);
  }, []);

  if (loading) {
    return <CenteredLoading />;
  }

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={() =>
          discountDataValidationSchema(checkStaticCode, checkLanding)
        }
        onSubmit={values => {
          const newValues = {
            ...values,
            startDate: format(new Date(values.startDate), "yyyy-MM-dd"),
            endDate: format(new Date(values.endDate), "yyyy-MM-dd"),
            discount: Number(values.discount)
          };
          void updateDiscount(agreement.id, newValues);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form autoComplete="off">
            <FormSection hasIntroduction>
              <DiscountInfo formValues={values} setFieldValue={setFieldValue} />
              <FormField
                htmlFor="productCategories"
                isTitleHeading
                title="Categorie merceologiche"
                description="Seleziona la o le categorie merceologiche a cui appatengono i beni/servizi oggetto dell’agevolazione"
                isVisible
                required
              >
                <ProductCategories />
              </FormField>
              <FormField
                htmlFor="discountConditions"
                isTitleHeading
                title="Condizioni dell’agevolazione"
                description="Descrivere eventuali limitazioni relative all’agevolazione (es. sconto valido per l’acquisto di un solo abbonamento alla stagione di prosa presso gli sportelli del teatro) - Max 200 caratteri"
                isVisible
              >
                <DiscountConditions />
              </FormField>
              {checkStaticCode && (
                <FormField
                  htmlFor="staticCode"
                  isTitleHeading
                  title="Codice statico"
                  description="Inserire il codice relativo all’agevolazione che l’utente dovrà inserire sul vostro portale online"
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
                  title="Indirizzo della landing page"
                  description="Inserire l’URL della landing page da cui i titolari di CGN potranno accedere all’agevolazione"
                  isVisible
                  required
                >
                  <LandingPage />
                </FormField>
              )}
              {initialValues.state !== "draft" && (
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
                  >
                    Salva
                  </Button>
                </div>
              )}
              {initialValues.state === "draft" && (
                <div className="mt-10">
                  <Button
                    className="px-14 mr-4"
                    color="secondary"
                    tag="button"
                    onClick={() => history.push(DASHBOARD)}
                  >
                    Annulla
                  </Button>
                  <Button
                    type="submit"
                    className="px-14 mr-4"
                    color="primary"
                    outline
                    tag="button"
                  >
                    Salva
                  </Button>
                </div>
              )}
            </FormSection>
          </Form>
        )}
      </Formik>
      <PublishModal
        isOpen={publishModal}
        toggle={togglePublishModal}
        publish={() => publishDiscount(selectedPublish)}
      />
    </>
  );
};

export default EditDiscountForm;
