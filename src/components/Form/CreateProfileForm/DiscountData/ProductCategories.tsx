import React from "react";
import { Field } from "formik";
import FormSection from "../../FormSection";
import CheckboxField from "../../CheckboxField";

type Props = {
  errors: any;
  touched: any;
};

const ProductCategories = ({ errors, touched }: Props) => (
  <FormSection
    title="Categorie merceologiche"
    description="Seleziona la o le categorie merceologiche a cui appatengono i beni/servizi oggetto dell’agevolazione"
    required
    isVisible
  >
    <CheckboxField text="Viaggi" htmlFor="travels">
      <Field type="checkbox" name="productCategories" value="travels" />
    </CheckboxField>
    <CheckboxField text="Salute e Benessere" htmlFor="health">
      <Field type="checkbox" name="productCategories" value="health" />
    </CheckboxField>
    <CheckboxField text="Teatro, cinema e spettacolo" htmlFor="cinema">
      <Field type="checkbox" name="productCategories" value="cinema" />
    </CheckboxField>
    <CheckboxField text="Carsharing e mobilità" htmlFor="cars">
      <Field type="checkbox" name="productCategories" value="cars" />
    </CheckboxField>
    <CheckboxField text="Telefonia, servizi internet" htmlFor="internet">
      <Field type="checkbox" name="productCategories" value="internet" />
    </CheckboxField>
    <CheckboxField text="Libri, audiolibri, e-book" htmlFor="books">
      <Field type="checkbox" name="productCategories" value="books" />
    </CheckboxField>
    <CheckboxField text="Musei, gallerie e parchi" htmlFor="museums">
      <Field type="checkbox" name="productCategories" value="museums" />
    </CheckboxField>
    <CheckboxField text="Sport" htmlFor="sport">
      <Field type="checkbox" name="productCategories" value="sport" />
    </CheckboxField>
    <CheckboxField text="Altro" htmlFor="other">
      <Field type="checkbox" name="productCategories" value="other" />
    </CheckboxField>
  </FormSection>
);

export default ProductCategories;
