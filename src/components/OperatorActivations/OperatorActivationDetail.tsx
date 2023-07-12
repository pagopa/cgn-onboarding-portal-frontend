import { format } from "date-fns";
import React, { useState } from "react";
import { Button, Icon } from "design-react-kit";
import { useHistory } from "react-router-dom";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { OrganizationWithReferents } from "../../api/generated_backoffice";
import ProfileItem from "../Profile/ProfileItem";
import Api from "../../api/backoffice";
import { Severity, useTooltip } from "../../context/tooltip";
import CenteredLoading from "../CenteredLoading";
import DeleteModal from "./DeleteModal";

type Props = {
  operator: OrganizationWithReferents;
  getActivations: () => void;
};

const OperatorActivationDetail = ({ operator, getActivations }: Props) => {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { triggerTooltip } = useTooltip();

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const deleteActivation = async (keyOrganizationFiscalCode: string) =>
    await tryCatch(
      () =>
        Api.AttributeAuthority.deleteOrganization(keyOrganizationFiscalCode),
      toError
    )
      .map(response => response.data)
      .fold(
        () => {
          setLoading(false);
          triggerTooltip({
            severity: Severity.DANGER,
            text: "Rimozione dell'operatore fallita"
          });
        },
        () => {
          setLoading(false);
          getActivations();
        }
      )
      .run();

  const askDeleteOrganization = () => {
    setLoading(true);
    void deleteActivation(operator.keyOrganizationFiscalCode);
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
                  <p className="m-0 mr-4">{referent}</p>
                  {/* <Button */}
                  {/*  color="link" */}
                  {/*  onClick={constNull} */}
                  {/*  icon={true} */}
                  {/*  className={"p-0 align-self-center"} */}
                  {/* > */}
                  {/*  <Icon */}
                  {/*    icon="it-delete" */}
                  {/*    color="primary" */}
                  {/*    padding={false} */}
                  {/*    size="sm" */}
                  {/*  /> */}
                  {/* </Button> */}
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-10 d-flex flex-row">
        <Button
          className="mr-4 btn-sm"
          color="danger"
          outline
          tag="button"
          onClick={toggleModal}
        >
          {isLoading ? <CenteredLoading /> : <span> Rimuovi </span>}
        </Button>
        <Button
          className="mr-4 btn-sm"
          color="primary"
          outline
          tag="button"
          onClick={() =>
            history.push(
              `/admin/operatori/accessi/modifica/${operator.keyOrganizationFiscalCode}`
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
