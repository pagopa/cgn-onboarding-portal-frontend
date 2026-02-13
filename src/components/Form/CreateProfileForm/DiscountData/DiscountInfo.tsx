import { Lens } from "@hookform/lenses";
import FormField from "../../FormField";
import { MAX_SELECTABLE_CATEGORIES } from "../../../../utils/constants";
import { Profile } from "../../../../api/generated";
import { getDiscountTypeChecks } from "../../../../utils/formChecks";
import { DiscountFormInputValues } from "../../discountFormUtils";
import {
  Field,
  FormErrorMessage
} from "../../../../utils/react-hook-form-helpers";
import { selectAgreement } from "../../../../store/agreement/selectors";
import { useCgnSelector } from "../../../../store/hooks";
import ProductCategories from "./ProductCategories";
import DiscountConditions from "./DiscountConditions";
import EnrollToEyca from "./EnrollToEyca";
import Bucket from "./Bucket";
import LandingPage from "./LandingPage";
import StaticCode from "./StaticCode";
import DiscountUrl from "./DiscountUrl";
import { DiscountDates } from "./DiscountDates";

type Props = {
  profile: Profile;
  formLens: Lens<DiscountFormInputValues>;
  index?: number;
};

const DiscountInfo = ({ profile, formLens, index }: Props) => {
  const { checkBucket, checkLanding, checkStaticCode } =
    getDiscountTypeChecks(profile);

  const agreement = useCgnSelector(selectAgreement);

  return (
    <>
      <FormField
        htmlFor="name"
        title="Nome opportunità"
        description="Inserisci un breve testo che descriva il tipo di opportunità offerta (max 100 caratteri)"
        isVisible
        required
      >
        <div className="row">
          <div className="col-6">
            <p className="text-sm fw-normal text-black mb-0">Italiano 🇮🇹</p>
            <Field
              maxLength={100}
              id="name"
              formLens={formLens.focus("name")}
              type="text"
              className="form-control"
            />
            <FormErrorMessage formLens={formLens.focus("name")} />
          </div>
          <div className="col-6">
            <p className="text-sm fw-normal text-black mb-0">Inglese 🇬🇧</p>
            <Field
              maxLength={100}
              id="name"
              formLens={formLens.focus("name_en")}
              type="text"
              className="form-control"
            />
            <FormErrorMessage formLens={formLens.focus("name_en")} />
          </div>
        </div>
      </FormField>
      <FormField
        htmlFor="description"
        title="Descrizione opportunità"
        description="Se necessario, inserisci una descrizione più approfondita dell’opportunità - Max 250 caratteri"
        isVisible
      >
        <div className="row">
          <div className="col-6">
            <p className="text-sm fw-normal text-black mb-0">Italiano 🇮🇹</p>
            <Field
              element="textarea"
              id="description"
              formLens={formLens.focus("description")}
              placeholder="Es. Sconto valido per l’acquisto di due ingressi per la stagione di prosa 2021/2022 presso il Teatro Comunale"
              maxLength={250}
              rows={4}
              className="form-control"
            />
            <FormErrorMessage formLens={formLens.focus("description")} />
          </div>
          <div className="col-6">
            <p className="text-sm fw-normal text-black mb-0">Inglese 🇬🇧</p>
            <Field
              element="textarea"
              id="description_en"
              formLens={formLens.focus("description_en")}
              placeholder="Ex. Discount valid for the purchase of two tickets for the 2021/2022 prose season at the Municipal Theatre"
              maxLength={250}
              rows={4}
              className="form-control"
            />
            <FormErrorMessage formLens={formLens.focus("description_en")} />
          </div>
        </div>
      </FormField>
      <DiscountDates formLens={formLens} />
      <FormField
        htmlFor="discount"
        title="Entità dello sconto"
        description="Se l’opportunità lo prevede, inserire la percentuale (%) di sconto erogata"
        isVisible
      >
        <div className="input-group col-4 p-0">
          <div className="input-group-text">%</div>
          <Field
            type="text"
            id="discount"
            formLens={formLens.focus("discount")}
            className="form-control"
          />
        </div>
        <FormErrorMessage formLens={formLens.focus("discount")} />
      </FormField>
      <FormField
        htmlFor="productCategories"
        isTitleHeading
        title="Categorie merceologiche"
        description={`Seleziona al massimo ${MAX_SELECTABLE_CATEGORIES} categorie merceologiche a cui appatengono i beni/servizi oggetto dell’opportunità`}
        isVisible
        required
      >
        <ProductCategories index={index} formLens={formLens} />
      </FormField>
      <FormField
        htmlFor="discountConditions"
        isTitleHeading
        title="Condizioni dell’opportunità"
        description="Descrivi eventuali condizioni d’uso o limitazioni relative all’opportunità - Max 200 caratteri"
        isVisible
      >
        <DiscountConditions formLens={formLens} />
      </FormField>
      {!checkLanding && (
        <FormField
          htmlFor="discountUrl"
          title="Link all’opportunità"
          description="Inserisci l’URL del sito o dell’app dove sarà possibile accedere all’opportunità (max 500 caratteri)"
          isTitleHeading
          isVisible
        >
          <DiscountUrl formLens={formLens} />
        </FormField>
      )}
      {checkStaticCode && (
        <FormField
          htmlFor="staticCode"
          isTitleHeading
          title="Codice statico"
          description="Inserisci il codice che l’utente dovrà inserire per usufruire dell’opportunità (max 100 caratteri)"
          isVisible
          required
        >
          <StaticCode formLens={formLens} />
        </FormField>
      )}
      {checkLanding && (
        <FormField
          htmlFor="landingPage"
          isTitleHeading
          title="Indirizzo della landing page"
          description="Inserisci l’URL della pagina web da cui sarà possibile accedere all’opportunità (max 500 caratteri)"
          isVisible
          required
        >
          <LandingPage formLens={formLens} />
        </FormField>
      )}
      {checkBucket && (
        <Bucket
          agreementId={agreement.id}
          label={"Seleziona un file dal computer"}
          formLens={formLens}
        />
      )}
      {profile && (
        <EnrollToEyca profile={profile} formLens={formLens} index={index} />
      )}
    </>
  );
};

export default DiscountInfo;
