import React from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
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

const initialValues = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  discount: "",
  productCategories: [],
  condition: "",
  staticCode: ""
};

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(100)
    .required(),
  description: Yup.string()
    .max(250)
    .required(),
  startDate: Yup.date().required(),
  endDate: Yup.date().required(),
  discount: Yup.number()
    .min(1)
    .max(100)
    .required(),
  productCategories: Yup.array()
    .min(1)
    .required(),
  condition: Yup.string().max(200),
  staticCode: Yup.string()
});

type Props = {
  handleSuccess: any;
  handleBack: any;
  handleNext: any;
};

const DiscountData = ({ handleSuccess, handleBack, handleNext }: any) => {
  const agreementState = useSelector(
    (state: RootState) => state.agreement.value
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => {
        const discount: CreateDiscount = {
          ...values,
          discount: Number(values.discount)
        };

        if (agreementState) {
          void Api.Discount.createDiscount(agreementState.id, discount);
        }

        handleSuccess();
        handleNext();
      }}
    >
      {({ isValid, errors, touched }) => (
        <Form>
          <FormContainer className="mb-20">
            <DiscountInfo errors={errors} touched={touched} />
            <ProductCategories errors={errors} touched={touched} />
            <DiscountConditions errors={errors} touched={touched} />
            <StaticCode errors={errors} touched={touched}>
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
            </StaticCode>
          </FormContainer>
        </Form>
      )}
    </Formik>
  );
};

export default DiscountData;
