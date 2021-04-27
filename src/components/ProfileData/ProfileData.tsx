import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "design-react-kit";
import Api from "../../api/index";
import ProfileDataItem from "./ProfileDataItem";
import { Link } from "react-router-dom";
import { EDIT_PROFILE } from "../../navigation/routes";

const ProfileData = () => {
  const [profile, setProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<any>(null);
  const { value } = useSelector((state: any) => state.agreement);

  useEffect(() => {
    const getProfile = async (profileId: string) => {
      const response = await Api.Profile.getProfile(profileId);
      setProfile(response.data);
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
            <table className="table">
              <tbody>
                <ProfileDataItem
                  label="Nome Operatore visualizzato"
                  value={profile.name}
                />
                <ProfileDataItem
                  label="Descrizione dell'operatore"
                  value={profile.description}
                />
                <ProfileDataItem
                  label="Sito web"
                  value={profile.salesChannel.websiteUrl}
                />
                <ProfileDataItem
                  label="Indirizzo"
                  value={profile.legalOffice}
                />
                <ProfileDataItem label="Immagine operatore" />
              </tbody>
            </table>
          </section>
        </section>
      )}
    </>
  );
};

export default ProfileData;
