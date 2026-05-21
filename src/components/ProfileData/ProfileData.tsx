import { Link } from "react-router-dom";
import { Box } from "@mui/material";
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
        <Box component="section" sx={{ backgroundColor: "white", p: 4, mt: 2 }}>
          <Box component="section">
            <h2>Descrizione operatore</h2>
            <table>
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
                  <td>Immagine operatore</td>
                  <td>
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
              <Link to={EDIT_OPERATOR_DATA}>Modifica dati</Link>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProfileData;
