import { format } from "date-fns";
import { useState } from "react";
import { Button } from "design-react-kit";
import { useHistory } from "react-router-dom";
import { OrganizationWithReferents } from "../../api/generated_backoffice";
import ProfileItem from "../Profile/ProfileItem";
import { remoteData } from "../../api/common";
import { Severity, useTooltip } from "../../context/tooltip";
import { getEntityTypeLabel } from "../../utils/strings";
import { getEditOperatorRoute } from "../../navigation/utils";
import DeleteModal from "./DeleteModal";

type Props = {
  operator: OrganizationWithReferents;
  getActivations: () => void;
};

const OperatorActivationDetail = ({ operator, getActivations }: Props) => {
  const history = useHistory();
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
    <section className="px-6 py-4 bg-white">
      <table className="table">
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
            <td className={`px-0 text-gray border-bottom-0`}>
              Utenti Abilitati
            </td>
            <td className={`border-bottom-0`}>
              {operator.referents.map((referent, index) => (
                <div className="d-flex flex-row mb-3" key={index}>
                  <p className="m-0 me-4">{referent}</p>
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-10 d-flex flex-row">
        <Button
          className="me-4 btn-sm"
          color="danger"
          outline
          tag="button"
          onClick={toggleModal}
          disabled={deleteActivationMutation.isPending}
        >
          Rimuovi
        </Button>
        <Button
          className="me-4 btn-sm"
          color="primary"
          outline
          tag="button"
          onClick={() =>
            history.push(
              getEditOperatorRoute(operator.keyOrganizationFiscalCode)
            )
          }
        >
          <span>Modifica</span>
        </Button>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        onDelete={askDeleteOrganization}
      />
    </section>
  );
};
export default OperatorActivationDetail;
