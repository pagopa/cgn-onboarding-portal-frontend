import React from "react";
import { Field, useFormikContext } from "formik";
import * as Yup from "yup";
import FormSection from "./FormSection";
import CustomErrorMessage from "./CustomErrorMessage";
import { ProfileDataValidationSchema } from "./ValidationSchemas";

type SupportContactProps = { children?: React.ReactNode };
export function SupportContact({ children }: SupportContactProps) {
  const formikContext = useFormikContext<
    Yup.InferType<typeof ProfileDataValidationSchema>
  >();
  const contactType = formikContext.values.supportContact?.contactType;
  return (
    <FormSection
      title="Contatti di assistenza"
      description="Indicare un contatto di assistenza tra indirizzo e-mail, numero di telefono o sito web a cui gli utenti possono rivolgersi in caso di necessità"
      isVisible={true}
    >
      <div className="d-flex flex-column">
        <div className="form-check">
          <Field
            type="radio"
            id="support-contact-type-email"
            name="supportContact.contactType"
            value="email"
          />
          <label
            className="text-sm font-weight-normal text-black"
            htmlFor="support-contact-type-email"
          >
            <span className="text-sm">Email</span>
          </label>
        </div>
        {contactType === "email" && (
          <div className="ml-8">
            <Field
              id="supportContact.email"
              name="supportContact.email"
              type="email"
              placeholder="Inserire la mail"
            />
            <CustomErrorMessage name="supportContact.email" />
          </div>
        )}
        <div className="form-check">
          <Field
            type="radio"
            id="support-contact-type-phone"
            name="supportContact.contactType"
            value="phone"
          />
          <label
            className="text-sm font-weight-normal text-black"
            htmlFor="support-contact-type-phone"
          >
            <span className="text-sm">Telefono</span>
          </label>
        </div>
        {contactType === "phone" && (
          <div className="ml-8">
            <Field
              maxLength={15}
              id="supportContact.phone"
              name="supportContact.phone"
              type="tel"
              placeholder="Inserire il numero di telefono"
            />
            <CustomErrorMessage name="supportContact.phone" />
          </div>
        )}
        <div className="form-check">
          <Field
            type="radio"
            id="support-contact-type-website"
            name="supportContact.contactType"
            value="website"
          />
          <label
            className="text-sm font-weight-normal text-black"
            htmlFor="support-contact-type-website"
          >
            <span className="text-sm">Sito web</span>
          </label>
        </div>
        {contactType === "website" && (
          <div className="ml-8">
            <Field
              id="supportContact.website"
              name="supportContact.website"
              type="url"
              placeholder="inserire il sito web (completo di protocollo http/https)"
            />
            <CustomErrorMessage name="supportContact.website" />
          </div>
        )}
      </div>
      {children}
    </FormSection>
  );
}
