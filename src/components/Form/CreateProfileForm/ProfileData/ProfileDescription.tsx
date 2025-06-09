import { Field } from "formik";
import CustomErrorMessage from "../../CustomErrorMessage";
import FormSection from "../../FormSection";

const ProfileDescription = () => (
  <FormSection
    title="Descrizione dell'operatore"
    description="Inserisci una descrizione dei beni o servizi offerti agli utenti tramite app IO. La descrizione è obbligatoria sia in italiano che in inglese - Max 300 caratteri"
    required
    isVisible
  >
    <div className="row">
      <div className="col-6">
        <p className="text-sm fw-normal text-black mb-0">Italiano 🇮🇹</p>
        <Field
          as="textarea"
          id="description"
          name="description"
          placeholder="Inserisci una descrizione"
          maxLength="300"
          rows="4"
          className="form-control"
        />
      </div>
      <div className="col-6">
        <p className="text-sm fw-normal text-black mb-0">Inglese 🇬🇧</p>
        <Field
          as="textarea"
          id="description_en"
          name="description_en"
          placeholder="Type in the description"
          maxLength="300"
          rows="4"
          className="form-control"
        />
      </div>
    </div>
    <CustomErrorMessage name="description" />
  </FormSection>
);

export default ProfileDescription;
