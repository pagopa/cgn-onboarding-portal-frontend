import React from "react";
import { useSelector } from "react-redux";
import { FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import { Button } from "design-react-kit";
import Api from "../../../../api";
import { CreateDiscount } from "../../../../api/generated";
import DiscountInfo from "../../CreateProfileForm/DiscountData/DiscountInfo";
import ProductCategories from "../../CreateProfileForm/DiscountData/ProductCategories";
import DiscountConditions from "../../CreateProfileForm/DiscountData/DiscountConditions";
import StaticCode from "../../CreateProfileForm/DiscountData/StaticCode";
import FormContainer from "../../FormContainer";
import { RootState } from "../../../../store/store";
import FormSection from "../../FormSection";
import FormField from "../../FormField";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg";

const initialValues = {
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
        .max(100)
        .required(),
      description: Yup.string()
        .max(250)
        .required(),
      discount: Yup.number()
        .min(1)
        .max(100)
        .required(),
      productCategories: Yup.array()
        .min(1)
        .required(),
      condition: Yup.string().max(200),
      staticCode: Yup.string()
    })
  )
});

type Props = {
  handleSuccess: any;
  handleBack: any;
  handleNext: any;
};

const DiscountData = ({ handleSuccess, handleBack, handleNext }: Props) => {
  const agreementState = useSelector(
    (state: RootState) => state.agreement.value
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSubmit={values => {}}
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
                      handleClose={
                        index >= 1 ? () => arrayHelpers.remove(index) : null
                      }
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
