import { toError } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Api from "../../api/index";
import { EDIT_PROFILE } from "../../navigation/routes";
import { RootState } from "../../store/store";
import ProfileApiToken from "./ProfileApiToken";
import ProfileDocuments from "./ProfileDocuments";
import ProfileItem from "./ProfileItem";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const agreement = useSelector((state: RootState) => state.agreement.value);

  const getProfile = (agreementId: string) =>
    pipe(
      TE.tryCatch(() => Api.Profile.getProfile(agreementId), toError),
      TE.map(response => response.data),
      TE.map(profile => setProfile(profile)),
      TE.mapLeft(_ => void 0)
    )();

  const hasProfileApiToken = () =>
    agreement.state === "ApprovedAgreement" &&
    profile.salesChannel.discountCodeType === "API";

  useEffect(() => {
    void getProfile(agreement.id);
  }, []);

  return (
    <>
      {profile !== null && (
        <section className="mt-2 px-8 py-10 bg-white">
          <section>
            <h2 className="h5 font-weight-bold text-dark-blue">
              Dati relativi all&apos;operatore
            </h2>
            <table className="table border-bottom mb-4">
              <tbody>
                <ProfileItem
                  label="Ragione sociale operatore"
                  value={profile.fullName}
                />
                <ProfileItem
                  label="Codice Fiscale / Partita IVA"
                  value={profile.taxCodeOrVat}
                />
                <ProfileItem label="Indirizzo PEC" value={profile.pecAddress} />
                <ProfileItem label="Sede legale" value={profile.legalOffice} />
                <ProfileItem
                  label="Numero di telefono azienda"
                  value={profile.telephoneNumber}
                />
                <ProfileItem
                  label="Nome e cognome del legale rappresentante"
                  value={profile.legalRepresentativeFullName}
                />
                <ProfileItem
                  className="pb-8"
                  label="Codice fiscale del Legale rappresentante"
                  value={profile.legalRepresentativeTaxCode}
                />
              </tbody>
            </table>
          </section>
          <section>
            <h2 className="h5 pt-8 font-weight-bold text-dark-blue">
              Dati del referente incaricato
            </h2>
            <table className="table">
              <tbody>
                <ProfileItem label="Nome" value={profile.referent.firstName} />
                <ProfileItem
                  label="Cognome"
                  value={profile.referent.lastName}
                />
                <ProfileItem
                  label="Ruolo all’interno dell’azienda"
                  value={profile.referent.role}
                />
                <ProfileItem
                  label="Indirizzo e-mail"
                  value={profile.referent.emailAddress}
                />
                <ProfileItem
                  label="Numero di telefono diretto"
                  value={profile.referent.telephoneNumber}
                />
              </tbody>
            </table>
            {agreement.state === "ApprovedAgreement" && (
              <Link className="mt-4 btn btn-outline-primary" to={EDIT_PROFILE}>
                Modifica dati
              </Link>
            )}
          </section>
        </section>
      )}
      {profile && hasProfileApiToken() && <ProfileApiToken />}
      <ProfileDocuments />
    </>
  );
};

export default Profile;
