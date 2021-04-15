import React from "react";
import { Field, FieldArray } from "formik";
import { Link } from "react-router-dom";
import { ROOT } from "../../../navigation/routes";
import FormSection from "../FormSection";
import PlusIcon from "../../../assets/icons/plus.svg";
import PlusCircleIcon from "../../../assets/icons/plus-circle.svg";
import InputField from "../InputField";

const FooterDescription = (
  <p className="text-base font-weight-normal text-gray">
    Il file deve avere le seguenti caratteristiche:
    <br />
    Dimensione del file: minimo 800x600px
    <br />
    Formato del file: JPG, PNG
  </p>
);

const ProfileDescription = ({ formValues }: any) => (
  <>
    <FormSection
      hasIntroduction
      title="Immagine operatore"
      description="Caricare un'immagine che rappresenti i beni o i servizi trattati dall'Operatore"
      footerDescription={FooterDescription}
      required
      isVisible
    >
      <ul className="upload-pictures-wall">
        <li>
          <input
            type="file"
            name="profileImage"
            id="profileImage"
            className="upload pictures-wall"
          />
          <label htmlFor="profileImage">
            <PlusIcon className="icon icon-sm" />
            <span>Add photo</span>
          </label>
        </li>
      </ul>
    </FormSection>
    <FormSection
      title="Descrizione dell'operatore"
      description="Inserire una descrizione che spieghi i beni o servizi trattati agli utenti dell'app - Max 300 caratteri"
      required
      isVisible
    >
      <Field
        as="textarea"
        id="description"
        name="description"
        placeholder="Inserisci una descrizione"
      />
    </FormSection>
    <FormSection
      title="Definizione del canale di vendita"
      description="Seleziona una delle opzioni disponibili"
      required
      isVisible
    >
      <div
        className="d-flex flex-column"
        role="group"
        aria-labelledby="my-radio-group"
      >
        <label className="text-sm font-weight-normal text-black">
          <Field type="radio" name="SalesChannelType" value="OnlineChannel" />
          <span className="ml-4">Fisico</span>
        </label>
        <label className="mt-9 mr-4 text-sm font-weight-normal text-black">
          <Field type="radio" name="SalesChannelType" value="OfflineChannel" />
          <span className="ml-4">Online</span>
        </label>
        <label className="mt-9 text-sm font-weight-normal text-black">
          <Field type="radio" name="SalesChannelType" value="BothChannels" />
          <span className="ml-4">Entrambi</span>
        </label>
      </div>
    </FormSection>

    <FieldArray
      name="address"
      render={arrayHelpers => (
        <FormSection
          title="Indirizzo"
          description="Inserisci l'indirizzo del punto vendita, se si hanno più punti vendita inserisci gli indirizzi aggiuntivi"
          required
          isVisible
        >
          {formValues.addresses.map((address: any, index: number) => (
            <div key={index}>
              <InputField htmlFor="street" title="Indirizzo">
                <Field
                  id="street"
                  name={`address[${index}].street`}
                  type="text"
                />
              </InputField>
              <InputField htmlFor="zipCode" title="CAP">
                <Field
                  id="zipCode"
                  name={`address[${index}].zipCode`}
                  type="text"
                  placeholder="Inserisci il CAP"
                />
              </InputField>
              <InputField htmlFor="city" title="Città">
                <Field
                  id="city"
                  name={`address[${index}].city`}
                  type="text"
                  placeholder="Inserisci la città"
                />
              </InputField>
              <InputField htmlFor="district" title="Provincia">
                <Field
                  id="district"
                  name={`address[${index}].district`}
                  type="text"
                  placeholder="Inserisci la provincia"
                />
              </InputField>

              <div
                className="mt-8"
                onClick={() =>
                  arrayHelpers.push({
                    street: "",
                    zipCode: "",
                    city: "",
                    district: ""
                  })
                }
              >
                <PlusCircleIcon className="mr-2" />
                <span className="text-base font-weight-semibold text-blue">
                  Aggiungi un indirizzo aggiuntivo
                </span>
              </div>
            </div>
          ))}
        </FormSection>
      )}
    ></FieldArray>

    <FormSection
      title="Sito web"
      description="Inserire l'URL del proprio e-commerce"
      required
      isVisible
    >
      <Field id="websiteUrl" name="websiteUrl" type="text" />
      <div className="row">
        <div className="col-6">
          <Link to={ROOT} className="btn btn-outline-primary mt-9 mr-2 px-14">
            Annulla
          </Link>
          <button type="submit" className="btn btn-primary mt-9 px-14">
            Salva
          </button>
        </div>
      </div>
    </FormSection>
  </>
);

export default ProfileDescription;
