import { format } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { OrganizationWithReferents } from "../../api/generated_backoffice";
import ProfileItem from "../Profile/ProfileItem";
import { remoteData } from "../../api/common";
import { Severity, useTooltip } from "../../context/tooltip";
import { getEntityTypeLabel } from "../../utils/strings";
import { getEditOperatorRoute } from "../../navigation/utils";
import AsyncButton from "../AsyncButton/AsyncButton";
import DeleteModal from "./DeleteModal";

type Props = {
  operator: OrganizationWithReferents;
  getActivations: () => void;
};

const OperatorActivationDetail = ({ operator, getActivations }: Props) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { triggerTooltip } = useTooltip();

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const deleteActivationMutation =
    remoteData.Backoffice.AttributeAuthority.deleteOrganization.useMutation({
      onSuccess() {
        getActivations();
      },
      onError() {
        triggerTooltip({
          severity: Severity.DANGER,
          text: "Rimozione dell'operatore fallita"
        });
      }
    });
  const askDeleteOrganization = () => {
    deleteActivationMutation.mutate({
      keyOrganizationFiscalCode: operator.keyOrganizationFiscalCode
    });
  };

  return (
    <section style={{ backgroundColor: "white", padding: "1.5rem" }}>
      <table>
        <tbody>
          <ProfileItem
            label="Ragione sociale operatore"
            value={operator.organizationName}
          />
          <ProfileItem
            label="Tipologia di ente"
            value={getEntityTypeLabel(operator.entityType)}
          />
          <ProfileItem
            label="Partita IVA"
            value={operator.keyOrganizationFiscalCode}
            // NICE_TO_HAVE: aggiungere validazione della partita iva (può essere nazionale o estera, non può essere codice fiscale)
          />
          <ProfileItem label="Indirizzo PEC" value={operator.pec} />
          {operator.insertedAt && (
            <ProfileItem
              label="Aggiunto il"
              value={format(new Date(operator.insertedAt), "dd/MM/yyyy")}
            />
          )}
          <tr>
            <td
              style={{ paddingLeft: 0, color: "#5C6F82", borderBottom: "none" }}
            >
              Utenti Abilitati
            </td>
            <td style={{ borderBottom: "none" }}>
              {operator.referents.map((referent, index) => (
                <div key={index}>
                  <p>{referent}</p>
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
      <Box sx={{ display: "flex", gap: 1 }}>
        <AsyncButton
          color="error"
          variant="outlined"
          onClick={toggleModal}
          loading={deleteActivationMutation.isPending}
        >
          Rimuovi
        </AsyncButton>
        <Button
          color="primary"
          variant="outlined"
          type="button"
          onClick={() =>
            navigate(getEditOperatorRoute(operator.keyOrganizationFiscalCode))
          }
        >
          <span>Modifica</span>
        </Button>
      </Box>
      <DeleteModal
        isOpen={isModalOpen}
        isPending={deleteActivationMutation.isPending}
        onToggle={toggleModal}
        actionRequest={askDeleteOrganization}
      />
    </section>
  );
};
export default OperatorActivationDetail;
