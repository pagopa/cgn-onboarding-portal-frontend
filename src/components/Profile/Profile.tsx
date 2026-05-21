import { Link } from "react-router-dom";
import { Box, Table, TableBody } from "@mui/material";
import { remoteData } from "../../api/common";
import { EDIT_PROFILE } from "../../navigation/routes";
import { SalesChannelType, type Referent } from "../../api/generated";
import { getEntityTypeLabel } from "../../utils/strings";
import { NormalizedSalesChannel } from "../../api/dtoTypeFixes";
import { selectAgreement } from "../../store/agreement/selectors";
import { useCgnSelector } from "../../store/hooks";
import ProfileItem from "./ProfileItem";
import ProfileDocuments from "./ProfileDocuments";
import ProfileApiToken from "./ProfileApiToken";

const Profile = () => {
  const agreement = useCgnSelector(selectAgreement);

  const { data: profile } = remoteData.Index.Profile.getProfile.useQuery({
    agreementId: agreement.id
  });

  const salesChannel = profile?.salesChannel as
    | NormalizedSalesChannel
    | undefined;

  const hasProfileApiToken =
    agreement.state === "ApprovedAgreement" &&
    salesChannel &&
    (salesChannel.channelType === SalesChannelType.OnlineChannel ||
      salesChannel.channelType === SalesChannelType.BothChannels) &&
    salesChannel.discountCodeType === "API";

  return (
    <>
      {profile && (
        <Box component="section" sx={{ backgroundColor: "white", p: 4, mt: 2 }}>
          <Box component="section">
            <h2>Dati relativi all&apos;operatore</h2>
            <Table>
              <TableBody>
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
                  label="Codice fiscale del Legale rappresentante"
                  value={profile.legalRepresentativeTaxCode}
                />
              </TableBody>
            </Table>
          </Box>
          {[profile.referent, ...(profile.secondaryReferents ?? [])].map(
            (referent: Referent, index, array) => {
              const title =
                index === 0
                  ? "Dati del referente incaricato"
                  : `Referente ${index + 1}`;
              return (
                <Box component="section" key={index} sx={{ mt: 3 }}>
                  <h2>{title}</h2>
                  <Table>
                    <TableBody>
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
                    </TableBody>
                  </Table>
                  {index === array.length - 1 &&
                    agreement.state === "ApprovedAgreement" && (
                      <Link to={EDIT_PROFILE}>Modifica dati</Link>
                    )}
                </Box>
              );
            }
          )}
        </Box>
      )}
      {profile && hasProfileApiToken && <ProfileApiToken />}
      <ProfileDocuments />
    </>
  );
};

export default Profile;
