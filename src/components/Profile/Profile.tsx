import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { remoteData } from "../../api/common";
import { EDIT_PROFILE } from "../../navigation/routes";
import { RootState } from "../../store/store";
import { Profile, Referent } from "../../api/generated";
import { getEntityTypeLabel } from "../../utils/strings";
import ProfileItem from "./ProfileItem";
import ProfileDocuments from "./ProfileDocuments";
import ProfileApiToken from "./ProfileApiToken";

const Profile = () => {
  const agreement = useSelector((state: RootState) => state.agreement.value);

  const profileQuery = remoteData.Index.Profile.getProfile.useQuery({
    agreementId: agreement.id
  });
  const profile = profileQuery.data;

  const hasProfileApiToken = () =>
    agreement.state === "ApprovedAgreement" &&
    (profile?.salesChannel as any).discountCodeType === "API";

  return (
    <>
      {profile && (
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
                <ProfileItem label="Partita IVA" value={profile.taxCodeOrVat} />
                <ProfileItem
                  label="Tipologia di ente"
                  value={getEntityTypeLabel(agreement.entityType)}
                />
                <ProfileItem label="Indirizzo PEC" value={profile.pecAddress} />
                <ProfileItem label="Sede legale" value={profile.legalOffice} />
                <ProfileItem
                  label="Numero di telefono ente"
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
          {[profile.referent, ...(profile.secondaryReferents ?? [])].map(
            (referent: Referent, index, array) => {
              const title =
                index === 0
                  ? "Dati del referente incaricato"
                  : `Referente ${index + 1}`;
              return (
                <section key={index}>
                  <h2 className="h5 pt-8 font-weight-bold text-dark-blue">
                    {title}
                  </h2>
                  <table className="table">
                    <tbody>
                      <ProfileItem label="Nome" value={referent.firstName} />
                      <ProfileItem label="Cognome" value={referent.lastName} />
                      <ProfileItem
                        label="Ruolo all’interno dell’ente"
                        value={referent.role}
                      />
                      <ProfileItem
                        label="Indirizzo e-mail"
                        value={referent.emailAddress}
                      />
                      <ProfileItem
                        label="Numero di telefono diretto"
                        value={referent.telephoneNumber}
                      />
                    </tbody>
                  </table>
                  {index === array.length - 1 &&
                    agreement.state === "ApprovedAgreement" && (
                      <Link
                        className="mt-4 btn btn-outline-primary"
                        to={EDIT_PROFILE}
                      >
                        Modifica dati
                      </Link>
                    )}
                </section>
              );
            }
          )}
        </section>
      )}
      {profile && hasProfileApiToken() && <ProfileApiToken />}
      <ProfileDocuments />
    </>
  );
};

export default Profile;
