import { toError } from "fp-ts/lib/Either";
import { tryCatch } from "fp-ts/lib/TaskEither";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Api from "../../api/index";
import { EDIT_OPERATOR_DATA } from "../../navigation/routes";
import { RootState } from "../../store/store";
import MultilanguageProfileItem from "../Profile/MultilanguageProfileItem";
import ProfileDataItem from "./ProfileDataItem";

const ProfileData = () => {
  const [profile, setProfile] = useState<any>(null);
  const agreement = useSelector((state: RootState) => state.agreement.value);

  const getProfile = async (agreementId: string) =>
    await tryCatch(() => Api.Profile.getProfile(agreementId), toError)
      .map(response => response.data)
      .fold(
        () => void 0,
        newProfile => setProfile(newProfile)
      )
      .run();

  const getImage = () =>
    agreement &&
    agreement.imageUrl?.includes(process.env.BASE_IMAGE_PATH as string)
      ? agreement.imageUrl
      : `${process.env.BASE_IMAGE_PATH}/${agreement.imageUrl}`;

  useEffect(() => {
    void getProfile(agreement.id);
  }, []);

  return (
    <>
      {profile && (
        <section className="mt-2 px-8 py-10 bg-white">
          <section>
            <h2 className="h5 font-weight-bold text-dark-blue">
              Descrizione operatore
            </h2>
            <table className="table">
              <tbody>
                {Boolean(profile.name) && (
                  <ProfileDataItem
                    label="Nome operatore visualizzato"
                    value={profile.name}
                  />
                )}
                <MultilanguageProfileItem
                  label="Descrizione dell'operatore"
                  value={profile.description}
                  value_en={profile.description_en}
                />
                {Boolean(profile.salesChannel.websiteUrl) && (
                  <ProfileDataItem
                    label="Sito web"
                    value={profile.salesChannel.websiteUrl}
                  />
                )}
                <ProfileDataItem
                  label="Indirizzo"
                  value={profile.legalOffice}
                />
                <tr>
                  <td className="px-0 border-bottom-0">Immagine operatore</td>
                  <td className="text-gray border-bottom-0">
                    <img
                      src={`${getImage()}?${Date.now()}`}
                      style={{
                        width: "170px",
                        height: "130px",
                        objectFit: "cover"
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            {agreement.state === "ApprovedAgreement" && (
              <Link
                className="mt-8 btn btn-outline-primary"
                to={EDIT_OPERATOR_DATA}
              >
                Modifica dati
              </Link>
            )}
          </section>
        </section>
      )}
    </>
  );
};

export default ProfileData;
