import React from "react";
import { Field, useFormikContext } from "formik";
import * as Yup from "yup";
import { SupportType } from "../../api/generated";
import FormSection from "./FormSection";
import CustomErrorMessage from "./CustomErrorMessage";
import { ProfileDataValidationSchema } from "./ValidationSchemas";

type SupportContactProps = { children?: React.ReactNode };
export function SupportContact({ children }: SupportContactProps) {
  const formikContext = useFormikContext<
    Yup.InferType<typeof ProfileDataValidationSchema>
  >();
  const contactType = formikContext.values.supportType;
  return (
    <FormSection
      title="Contatti di assistenza"
      description="Indicare un contatto di assistenza tra indirizzo e-mail, numero di telefono o sito web a cui gli utenti possono rivolgersi in caso di necessità"
      isVisible={true}
    >
      <div className="d-flex flex-column">
        <div className="ml-8">
          <CustomErrorMessage name="supportType" />
        </div>
        <div className="form-check">
          <Field
            type="radio"
            id="support-contact-type-email"
            name="supportType"
            value={SupportType.EmailAddress}
          />
          <label
            className="text-sm font-weight-normal text-black"
            htmlFor="support-contact-type-email"
          >
            <span className="text-sm">Email</span>
          </label>
        </div>
        {contactType === SupportType.EmailAddress && (
          <div className="ml-8">
            <Field
              id="supportValue"
              name="supportValue"
              type="email"
              placeholder="Inserire la mail"
            />
            <CustomErrorMessage name="supportValue" />
          </div>
        )}
        <div className="form-check">
          <Field
            type="radio"
            id="support-contact-type-phone"
            name="supportType"
            value={SupportType.PhoneNumber}
          />
          <label
            className="text-sm font-weight-normal text-black"
            htmlFor="support-contact-type-phone"
          >
            <span className="text-sm">Telefono</span>
          </label>
        </div>
        {contactType === SupportType.PhoneNumber && (
          <div className="ml-8">
            <Field
              maxLength={15}
              id="supportValue"
              name="supportValue"
              type="tel"
              placeholder="Inserire il numero di telefono"
            />
            <CustomErrorMessage name="supportValue" />
          </div>
        )}
        <div className="form-check">
          <Field
            type="radio"
            id="support-contact-type-website"
            name="supportType"
            value={SupportType.Website}
          />
          <label
            className="text-sm font-weight-normal text-black"
            htmlFor="support-contact-type-website"
          >
            <span className="text-sm">Sito web</span>
          </label>
        </div>
        {contactType === SupportType.Website && (
          <div className="ml-8">
            <Field
              id="supportValue"
              name="supportValue"
              type="url"
              placeholder="inserire il sito web (completo di protocollo http/https)"
            />
            <CustomErrorMessage name="supportValue" />
          </div>
        )}
      </div>
      {children}
    </FormSection>
  );
}
