import React from "react";
import { Field } from "formik";
import { Link } from "react-router-dom";
import { ROOT } from "../../../navigation/routes";
import FormSection from "../FormSection";
import InputField from "../CreateProfileForm/InputField";
import Plus from "../../../assets/icons/plus.svg";

const ProfileDescription = () => (
  <>
    <FormSection
      hasIntroduction
      title="Immagine operatore"
      description="Caricare un'immagine che rappresenti i beni o i servizi trattati dall'Operatore"
      required
      isVisible
    >
      <div className="upload-pictures-wall">
        <input
          type="file"
          name="upload5"
          id="upload5"
          className="upload pictures-wall"
        />
        <label
          htmlFor="photo"
          className="d-flex flex-column justify-content-center align-items-center text-center"
        >
          <Plus />
          <span>Add photo</span>
        </label>
      </div>
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
    <FormSection
      title="Indirizzo"
      description="Inserisci l'indirizzo del punto vendita, se si hanno più punti vendita inserisci gli indirizzi aggiuntivi"
      required
      isVisible
    >
      <InputField htmlFor="street" title="Indirizzo">
        <Field id="street" name="street" type="text" />
      </InputField>
      <InputField htmlFor="street" title="CAP">
        <Field
          id="street"
          name="street"
          type="text"
          placeholder="Inserisci il CAP"
        />
      </InputField>
      <InputField htmlFor="street" title="Città">
        <Field
          id="street"
          name="street"
          type="text"
          placeholder="Inserisci la città"
        />
      </InputField>
      <InputField htmlFor="street" title="Provincia">
        <Field
          id="street"
          name="street"
          type="text"
          placeholder="Inserisci la provincia"
        />
      </InputField>
    </FormSection>
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
