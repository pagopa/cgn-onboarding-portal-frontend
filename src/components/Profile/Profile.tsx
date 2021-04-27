import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "design-react-kit";
import Api from "../../api/index";
import ProfileItem from "./ProfileItem";
import ProfileDocuments from "./ProfileDocuments";
import { Link } from "react-router-dom";
import { EDIT_PROFILE } from "../../navigation/routes";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<any>(null);
  const { value } = useSelector((state: any) => state.agreement);

  useEffect(() => {
    const getProfile = async (profileId: string) => {
      const response = await Api.Profile.getProfile(profileId);
      setProfile(response.data);
    };

    const getDocuments = async (agreementId: string) => {
      const response = await Api.Document.getDocuments(agreementId);
      setDocuments(response.data.items);
    };
    void getProfile(value.id);
  }, []);

  return (
    <>
      {profile !== null && (
        <section className="mt-2 px-8 py-10 bg-white">
          <section>
            <h2 className="h4 font-weight-bold text-dark-blue">
              Dati relativi all&apos;operatore
            </h2>
            <table className="table border-bottom">
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
                  label="Numero di telefono"
                  value={profile.telephoneNumber}
                />
                <ProfileItem
                  label="Nome e cognome del legale rappresentante"
                  value={profile.legalRepresentativeFullName}
                />
                <ProfileItem
                  label="Codice fiscale del Legale rappresentante"
                  value={profile.legalRepresentativeTaxCode}
                />
              </tbody>
            </table>
          </section>
          <section>
            <h2 className="h4 font-weight-bold text-dark-blue">
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
                  label="Numero di telefono"
                  value={profile.referent.telephoneNumbe}
                />
              </tbody>
            </table>
            <Link className="btn btn-outline-primary" to={EDIT_PROFILE}>
              Modifica dati
            </Link>
          </section>
        </section>
      )}
      <ProfileDocuments />
    </>
  );
};

export default Profile;
