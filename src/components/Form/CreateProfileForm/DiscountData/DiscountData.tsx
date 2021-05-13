import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FieldArray, Form, Formik } from "formik";
import { Button } from "design-react-kit";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { format } from "date-fns";
import Api from "../../../../api";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import DiscountInfo from "../../CreateProfileForm/DiscountData/DiscountInfo";
import ProductCategories from "../../CreateProfileForm/DiscountData/ProductCategories";
import DiscountConditions from "../../CreateProfileForm/DiscountData/DiscountConditions";
import StaticCode from "../../CreateProfileForm/DiscountData/StaticCode";
import FormContainer from "../../FormContainer";
import { RootState } from "../../../../store/store";
import FormSection from "../../FormSection";
import FormField from "../../FormField";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg";
import { CreateDiscount, Discount } from "../../../../api/generated";
import { discountDataValidationSchema } from "../../ValidationSchemas";

const emptyInitialValues = {
  discounts: [
    {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      discount: "",
      productCategories: [],
      condition: "",
      staticCode: ""
    }
  ]
};

type Props = {
  isCompleted: boolean;
  handleBack: () => void;
  handleNext: () => void;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const DiscountData = ({ handleBack, handleNext, isCompleted }: Props) => {
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [initialValues, setInitialValues] = useState<any>(emptyInitialValues);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>();

  const createDiscount = async (
    agreementId: string,
    discount: CreateDiscount
  ) =>
    await tryCatch(
      () => Api.Discount.createDiscount(agreementId, discount),
      toError
    )
      .map(response => response.data)
      .fold(
        () => void 0,
        () => handleNext()
      )
      .run();

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
        Api.Discount.updateDiscount(agreementId, discount.id, updatedDiscount),
      toError
    )
      .map(response => response.data)
      .fold(
        () => void 0,
        () => handleNext()
      )
      .run();
  };

  const getDiscounts = async (agreementId: string) =>
    await tryCatch(() => Api.Discount.getDiscounts(agreementId), toError)
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        discounts => {
          setInitialValues({
            discounts: discounts.items.map(discount => ({
              ...discount,
              startDate: new Date(discount.startDate),
              endDate: new Date(discount.endDate)
            }))
          });
          setLoading(false);
        }
      )
      .run();

  const deleteDiscount = async (agreementId: string, discountId: string) =>
    await tryCatch(
      () => Api.Discount.deleteDiscount(agreementId, discountId),
      toError
    ).run();

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
    if (isCompleted) {
      setLoading(true);
      void getDiscounts(agreement.id);
    } else {
      setLoading(false);
    }
    void getProfile(agreement.id);
  }, []);

  if (loading) {
    return <CenteredLoading />;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={discountDataValidationSchema}
      onSubmit={values => {
        const newValues = {
          discounts: values.discounts.map((discount: CreateDiscount) => ({
            ...discount,
            startDate: format(new Date(discount.startDate), "yyyy-MM-dd"),
            endDate: format(new Date(discount.endDate), "yyyy-MM-dd")
          }))
        };
        newValues.discounts.forEach((discount: CreateDiscount) => {
          if (isCompleted) {
            void updateDiscount(agreement.id, discount as Discount);
          } else {
            void createDiscount(agreement.id, discount);
          }
        });
      }}
    >
      {({ isValid, dirty, values, setFieldValue }) => (
        <Form autoComplete="off">
          <FieldArray
            name="discounts"
            render={arrayHelpers => (
              <>
                {values.discounts.map((discount: any, index: number) => (
                  <FormContainer
                    key={index}
                    className={index <= 1 ? "mb-20" : ""}
                  >
                    <FormSection
                      hasIntroduction
                      hasClose={index >= 1}
                      handleClose={() => {
                        if (index >= 1) {
                          if (isCompleted) {
                            void deleteDiscount(agreement.id, discount.id);
                          }
                          arrayHelpers.remove(index);
                        }
                      }}
                    >
                      <DiscountInfo
                        formValues={values}
                        setFieldValue={setFieldValue}
                        index={index}
                      />
                      <FormField
                        htmlFor="productCategories"
                        isTitleHeading
                        title="Categorie merceologiche"
                        description="Seleziona la o le categorie merceologiche a cui appatengono i beni/servizi oggetto dell’agevolazione"
                        isVisible
                        required
                      >
                        <ProductCategories index={index} />
                      </FormField>
                      <FormField
                        htmlFor="discountConditions"
                        isTitleHeading
                        title="Condizioni dell’agevolazione"
                        description="Descrivere eventuali limitazioni relative all’agevolazione (es. sconto valido per l’acquisto di un solo abbonamento alla stagione di prosa presso gli sportelli del teatro) - Max 200 caratteri"
                        isVisible
                      >
                        <DiscountConditions index={index} />
                      </FormField>
                      {profile &&
                        (profile.salesChannel.channelType === "OnlineChannel" ||
                          profile.salesChannel.channelType ===
                            "BothChannels") &&
                        profile.salesChannel.discountCodeType === "Static" && (
                          <FormField
                            htmlFor="staticCode"
                            isTitleHeading
                            title="Codice statico"
                            description="Inserire il codice relativo all’agevolazione che l’utente dovrà inserire sul vostro portale online"
                            isVisible
                            required
                          >
                            <StaticCode index={index} />
                          </FormField>
                        )}
                      {values.discounts.length - 1 === index && (
                        <>
                          <div className="mt-8">
                            <PlusCircleIcon
                              className="mr-2"
                              onClick={() =>
                                arrayHelpers.push({
                                  name: "",
                                  description: "",
                                  startDate: "",
                                  endDate: "",
                                  discount: "",
                                  productCategories: [],
                                  condition: "",
                                  staticCode: ""
                                })
                              }
                            />
                            <span className="text-base font-weight-semibold text-blue">
                              Aggiungi un&apos;altra agevolazione
                            </span>
                          </div>
                          <div className="mt-10">
                            <Button
                              className="px-14 mr-4"
                              outline
                              color="primary"
                              tag="button"
                              onClick={handleBack}
                            >
                              Indietro
                            </Button>
                            <Button
                              type="submit"
                              className="px-14 mr-4"
                              color="primary"
                              tag="button"
                              disabled={!isValid || !dirty}
                            >
                              Continua
                            </Button>
                          </div>
                        </>
                      )}
                    </FormSection>
                  </FormContainer>
                ))}
              </>
            )}
          ></FieldArray>
        </Form>
      )}
    </Formik>
  );
};

export default DiscountData;
