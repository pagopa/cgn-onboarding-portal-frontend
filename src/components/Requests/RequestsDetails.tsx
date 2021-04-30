import React from "react";
import { Button, Icon } from "design-react-kit";
import DocumentIcon from "../../assets/icons/document.svg";
import Api from "../../api/backoffice";
import RequestItem from "./RequestsDetailsItem";

const RequestsDetails = ({ original, updateList }) => {
  const assignAgreementsApi = async () => {
    const response = await Api.Agreement.assignAgreement(original.id);
    updateList();
  };

  const approveAgreementApi = async () => {
    const response = await Api.Agreement.approveAgreement(original.id);
    return response.data;
  };

  const rejectAgreementApi = async () => {
    const response = await Api.Agreement.rejectAgreement(original.id, {
      reasonMessage: ""
    });
    return response.data;
  };

  return (
    <section className="px-6 py-4 bg-white">
      <h1 className="h5 font-weight-bold text-dark-blue mb-5">Dettagli</h1>
      <div className="container">
        <RequestItem
          label="Ragione sociale operatore"
          value={original.profile.fullName}
        />
        <RequestItem
          label="Numero agevolazioni proposte"
          value={original.discounts.length}
        />
        <div className="ml-3">
          {original.discounts.map((doc: { name: any }, i: number) => (
            <RequestItem
              key={i}
              label={`Agevolazione #${i + 1}`}
              value={doc.name}
            />
          ))}
        </div>
      </div>
      <h1 className="h5 font-weight-bold text-dark-blue mb-5">
        Dati del referente incaricato
      </h1>
      <div className="container">
        <RequestItem
          label="Nome e cognome"
          value={`${original.profile.referent.firstName} ${original.profile.referent.lastName}`}
        />
        <RequestItem
          label="Indirizzo e-mail"
          value={original.profile.referent.emailAddress}
        />
        <RequestItem
          label="Numero di telefono"
          value={original.profile.referent.telephoneNumber}
        />
      </div>
      <h1 className="h5 font-weight-bold text-dark-blue mb-5">Documenti</h1>
      {original.documents.map((doc, i) => (
        <div key={i} className="border-bottom py-5">
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div>
              <div className="mb-3 text-gray">
                {doc.documentType === "Agreement"
                  ? "Convenzione"
                  : `Allegato ${i + 1}`}
              </div>
              <div className="d-flex flex-row align-items-center">
                <DocumentIcon className="mr-4" />
                <a href={doc.documentUrl} target="_blank">
                  {doc.documentUrl.split("/").pop()}
                </a>
              </div>
            </div>
            <Button color="primary" icon size="sm" tag="button">
              <Icon
                color="white"
                icon="it-upload"
                padding={false}
                size="xs"
                className="mr-2"
              />
              Carica controfirmato
            </Button>
          </div>
        </div>
      ))}
      <div className="mt-10">
        <Button
          color="primary"
          outline
          tag="button"
          className="ml-4"
          disabled={original.state === "PendingAgreement"}
        >
          Rifiuta
        </Button>
        <Button
          color="primary"
          tag="button"
          className="ml-4"
          disabled={original.state === "PendingAgreement"}
        >
          Approva
        </Button>
        {original.state !== "AssignedAgreement" && (
          <Button
            color="primary"
            tag="button"
            className="ml-4"
            onClick={assignAgreementsApi}
          >
            Prendi in carica
          </Button>
        )}
      </div>
    </section>
  );
};

export default RequestsDetails;
