import { Icon, LinkList, LinkListItem } from "design-react-kit";
import { Fragment } from "react";
import { remoteData } from "../../api/common";
import { formatDate } from "../../utils/dates";
import { EntityType } from "../../api/generated";
import { selectAgreement } from "../../store/agreement/selectors";
import { useCgnSelector } from "../../store/hooks";

const ProfileDocuments = () => {
  const agreement = useCgnSelector(selectAgreement);

  const documentsQuery = remoteData.Index.Document.getDocuments.useQuery({
    agreementId: agreement.id
  });
  const agreementDocument = documentsQuery.data?.items.find(
    document =>
      document.documentType === "backoffice_agreement" ||
      document.documentType === "agreement"
  );
  const manifestationDocument = documentsQuery.data?.items.find(
    document =>
      document.documentType === "backoffice_adhesion_request" ||
      document.documentType === "adhesion_request"
  );

  const entityType = agreement.entityType;

  return (
    <>
      {agreementDocument && manifestationDocument && (
        <section className="mt-4 px-8 py-10 bg-white">
          <h2 className="h5 fw-bold text-dark-blue">Documenti</h2>
          <LinkList tag="div">
            <LinkListItem
              active
              className="d-flex flex-row align-items-center"
              tag="div"
            >
              <Icon icon="it-file" color="primary" className="me-4" />
              <div>
                <a
                  className="text-sm fw-semibold text-blue"
                  href={agreementDocument.documentUrl}
                  style={{ padding: 0 }}
                  rel="noreferrer"
                >
                  Convenzione
                </a>
                <p className="text-sm fw-light text-dark-blue">
                  Caricato il {formatDate(agreementDocument.documentTimestamp)}
                </p>
              </div>
            </LinkListItem>
            <LinkListItem divider tag="a" />
            {entityType === EntityType.Private && (
              <Fragment>
                <LinkListItem
                  tag="div"
                  className="d-flex flex-row align-items-center"
                >
                  <Icon icon="it-file" color="primary" className="me-4" />
                  <div className="flex flex-row justify-items-start">
                    <a
                      className="text-sm fw-semibold text-blue"
                      href={manifestationDocument.documentUrl}
                      style={{ padding: 0 }}
                    >
                      Allegato 1 - Domanda di adesione alla CGN
                    </a>
                    <p className="text-sm fw-light text-dark-blue">
                      Caricato il{" "}
                      {formatDate(manifestationDocument.documentTimestamp)}
                    </p>
                  </div>
                </LinkListItem>
                <LinkListItem divider tag="a" />
              </Fragment>
            )}
            <LinkListItem
              tag="div"
              className="d-flex flex-row align-items-center"
            >
              <Icon icon="it-file" color="primary" className="me-4" />
              <div>
                <a
                  href="https://docs.pagopa.it/carta-giovani-nazionale"
                  target="_blank"
                  className="text-sm fw-semibold text-blue"
                  rel="noreferrer"
                  style={{ padding: 0 }}
                >
                  Documentazione tecnica
                </a>
              </div>
            </LinkListItem>
          </LinkList>
        </section>
      )}
    </>
  );
};

export default ProfileDocuments;
