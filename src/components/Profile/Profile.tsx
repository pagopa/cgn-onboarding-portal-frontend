import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import Api from "../../api/index";
import { EDIT_PROFILE } from "../../navigation/routes";
import { RootState } from "../../store/store";
import { EntityType, Profile, Referent } from "../../api/generated";
import ProfileItem from "./ProfileItem";
import ProfileDocuments from "./ProfileDocuments";
import ProfileApiToken from "./ProfileApiToken";

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const agreement = useSelector((state: RootState) => state.agreement.value);

  const getProfile = async (agreementId: string) =>
    await tryCatch(() => Api.Profile.getProfile(agreementId), toError)
      .map(response => response.data)
      .fold(
        () => void 0,
        profile => setProfile(profile)
      )
      .run();

  const hasProfileApiToken = () =>
    agreement.state === "ApprovedAgreement" &&
    (profile?.salesChannel as any).discountCodeType === "API";

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
                <ProfileItem label="Partita IVA" value={profile.taxCodeOrVat} />
                <ProfileItem
                  label="Tipologia di ente"
                  value={(() => {
                    switch (profile.entityType) {
                      case EntityType.PublicAdministration:
                        return "Pubblico";
                      case EntityType.Private:
                        return "Privato";
                    }
                  })()}
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
