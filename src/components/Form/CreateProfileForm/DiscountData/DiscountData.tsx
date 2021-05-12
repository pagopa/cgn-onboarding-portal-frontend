import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
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

const validationSchema = Yup.object().shape({
  discounts: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .max(100, "Massimo 100 caratteri")
        .required("Campo Obbligatorio"),
      description: Yup.string()
        .max(250, "Massimo 250 caratteri")
        .required("Campo Obbligatorio"),
      startDate: Yup.string().required("Campo Obbligatorio"),
      endDate: Yup.string().required("Campo Obbligatorio"),
      discount: Yup.number()
        .min(1, "Almeno un carattere")
        .max(100, "Massimo 100 caratteri")
        .required("Campo Obbligatorio"),
      productCategories: Yup.array()
        .min(1, "Almeno un carattere")
        .required(),
      condition: Yup.string().max(200, "Massimo 200 caratteri"),
      staticCode: Yup.string()
    })
  )
});

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

  const updateDiscount = async (agreementId: string, discount: Discount) =>
    await tryCatch(
      () => Api.Discount.updateDiscount(agreementId, discount.id, discount),
      toError
    )
      .map(response => response.data)
      .fold(
        () => void 0,
        () => handleNext()
      )
      .run();

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

  useEffect(() => {
    if (isCompleted) {
      setLoading(true);
      void getDiscounts(agreement.id);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <CenteredLoading />;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
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
      {({ isValid, values, setFieldValue }) => (
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
                      <FormField
                        htmlFor="staticCode"
                        isTitleHeading
                        title="Codice statico"
                        description="Inserire il codice relativo all’agevolazione che l’utente dovrà inserire sul vostro portale online*"
                        isVisible
                      >
                        <StaticCode index={index} />
                      </FormField>
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
                              disabled={!isValid}
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
