import { Link } from "react-router-dom";
import { remoteData } from "../../api/common";
import { EDIT_OPERATOR_DATA } from "../../navigation/routes";
import MultilanguageProfileItem from "../Profile/MultilanguageProfileItem";
import { selectAgreement } from "../../store/agreement/selectors";
import { useCgnSelector } from "../../store/hooks";
import ProfileDataItem from "./ProfileDataItem";

const ProfileData = () => {
  const agreement = useCgnSelector(selectAgreement);

  const { data: profile } = remoteData.Index.Profile.getProfile.useQuery({
    agreementId: agreement.id
  });

  const getImage = () =>
    agreement &&
    agreement.imageUrl?.includes(import.meta.env.CGN_IMAGE_BASE_URL)
      ? agreement.imageUrl
      : `${import.meta.env.CGN_IMAGE_BASE_URL}/${agreement.imageUrl}`;

  return (
    <>
      {profile && (
        <section className="mt-2 px-8 py-10 bg-white">
          <section>
            <h2 className="h5 fw-bold text-dark-blue">Descrizione operatore</h2>
            <table className="table">
              <tbody>
                {profile.name && (
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
                {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  profile.salesChannel.websiteUrl && (
                    <ProfileDataItem
                      label="Sito web"
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      value={profile.salesChannel.websiteUrl}
                    />
                  )
                }
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
