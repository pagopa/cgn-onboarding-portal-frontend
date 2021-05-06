import React from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Button } from "design-react-kit";
import { useParams } from "react-router-dom";
import Api from "../../../api";
import { CreateDiscount } from "../../../api/generated";
import DiscountInfo from "../CreateProfileForm/DiscountData/DiscountInfo";
import ProductCategories from "../CreateProfileForm/DiscountData/ProductCategories";
import DiscountConditions from "../CreateProfileForm/DiscountData/DiscountConditions";
import StaticCode from "../CreateProfileForm/DiscountData/StaticCode";
import { RootState } from "../../../store/store";

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
  description: Yup.string().max(250),
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

const EditDiscountForm = () => {
  const agreementState = useSelector(
    (state: RootState) => state.agreement.value
  );
  const { discountId } = useParams<any>();

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
      }}
    >
      {({ errors, touched }) => (
        <Form autoComplete="off">
          <DiscountInfo errors={errors} touched={touched} />
          <ProductCategories errors={errors} touched={touched} />
          <DiscountConditions errors={errors} touched={touched} />
          <StaticCode errors={errors} touched={touched}>
            <div className="mt-10 d-flex flex-row justify-content-between">
              <Button className="px-14 mr-4" color="secondary" tag="button">
                Annulla
              </Button>
              <Button
                className="px-14 mr-4"
                outline
                color="primary"
                tag="button"
                type="submit"
              >
                Salva
              </Button>
              <Button
                className="px-14"
                color="primary"
                tag="button"
                type="submit"
              >
                Pubblica
              </Button>
            </div>
          </StaticCode>
        </Form>
      )}
    </Formik>
  );
};

export default EditDiscountForm;
