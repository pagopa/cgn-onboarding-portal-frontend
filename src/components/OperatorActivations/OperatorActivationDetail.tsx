import { format } from "date-fns";
import React from "react";
import { Button, Icon } from "design-react-kit";
import { useHistory } from "react-router-dom";
import { constNull } from "fp-ts/lib/function";
import { OrganizationWithReferents } from "../../api/generated_backoffice";
import ProfileItem from "../Profile/ProfileItem";
import { ADMIN_PANEL_ACCESSI_EDIT } from "../../navigation/routes";

type Props = {
  operator: OrganizationWithReferents;
  getActivations: () => void;
};

const OperatorActivationDetail = ({ operator }: Props) => {
  const history = useHistory();

  return (
    <section className="px-6 py-4 bg-white">
      <table className="table">
        <tbody>
          <ProfileItem
            label="Ragione sociale operatore"
            value={operator.organizationName}
          />
          <ProfileItem
            label="Codice fiscale / Partita IVA"
            value={operator.keyOrganizationFiscalCode}
          />
          <ProfileItem label="Indirizzo PEC" value={operator.pec} />
          <ProfileItem
            label="Aggiunto il"
            value={format(new Date(operator.insertedAt), "dd/MM/yyyy")}
          />
          <tr>
            <td className={`px-0 text-gray border-bottom-0`}>
              Utenti Abilitati
            </td>
            <td className={`border-bottom-0`}>
              {operator.referents.map((referent, index) => (
                <div className="d-flex flex-row mb-3" key={index}>
                  <p className="m-0 mr-4">{referent}</p>{" "}
                  <Button
                    color="link"
                    onClick={constNull}
                    icon={true}
                    className={"p-0 align-self-center"}
                  >
                    <Icon
                      icon="it-delete"
                      color="primary"
                      padding={false}
                      size="sm"
                    />
                  </Button>
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
          onClick={constNull}
        >
          <span>Rimuovi</span>
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
    </section>
  );
};
export default OperatorActivationDetail;
