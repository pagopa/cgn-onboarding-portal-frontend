import React, { useEffect, useState } from "react";
import { Icon, LinkList, LinkListItem } from "design-react-kit";
import { useSelector } from "react-redux";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import Api from "../../api";
import { formatDate } from "../../utils/dates";
import { EntityType } from "../../api/generated";
import { RootState } from "../../store/store";

const ProfileDocuments = () => {
  const [agreementDocument, setAgreementDocument] = useState<any>();
  const [manifestationDocument, setManifestationDocument] = useState<any>();
  const agreement = useSelector((state: RootState) => state.agreement.value);

  const getDocuments = async (agreementId: string) =>
    await tryCatch(() => Api.Document.getDocuments(agreementId), toError)
      .map(response => response.data.items)
      .fold(
        () => void 0,
        documents => {
          setAgreementDocument(
            documents.find(
              document =>
                document.documentType === "backoffice_agreement" ||
                document.documentType === "agreement"
            )
          );
          setManifestationDocument(
            documents.find(
              document =>
                document.documentType === "backoffice_adhesion_request" ||
                document.documentType === "adhesion_request"
            )
          );
        }
      )
      .run();

  useEffect(() => {
    void getDocuments(agreement.id);
  }, []);

  const entityType = agreement.entityType;

  return (
    <>
      {agreementDocument && manifestationDocument && (
        <section className="mt-4 px-8 py-10 bg-white">
          <h2 className="h5 font-weight-bold text-dark-blue">Documenti</h2>
          <LinkList tag="div">
            <LinkListItem
              active
              className="d-flex flex-row align-items-center"
              tag="div"
            >
              <Icon icon="it-file" color="primary" className="mr-4" />
              <div>
                <a
                  className="text-sm font-weight-semibold text-blue"
                  href={agreementDocument.documentUrl}
                  style={{ padding: 0 }}
                  rel="noreferrer"
                >
                  Convenzione
                </a>
                <p className="text-sm font-weight-light text-dark-blue">
                  Caricato il {formatDate(agreementDocument.documentTimestamp)}
                </p>
              </div>
            </LinkListItem>
            <LinkListItem divider tag="a" />
            {entityType === EntityType.Private && (
              <LinkListItem
                tag="div"
                className="d-flex flex-row align-items-center"
              >
                <Icon icon="it-file" color="primary" className="mr-4" />
                <div className="flex flex-row justify-items-start">
                  <a
                    className="text-sm font-weight-semibold text-blue"
                    href={manifestationDocument.documentUrl}
                    style={{ padding: 0 }}
                  >
                    Allegato 1 - Domanda di adesione alla CGN
                  </a>
                  <p className="text-sm font-weight-light text-dark-blue">
                    Caricato il
                    {formatDate(manifestationDocument.documentTimestamp)}
                  </p>
                </div>
              </LinkListItem>
            )}
            <LinkListItem divider tag="a" />
            <LinkListItem
              tag="div"
              className="d-flex flex-row align-items-center"
            >
              <Icon icon="it-file" color="primary" className="mr-4" />
              <div>
                <a
                  href="https://docs.pagopa.it/carta-giovani-nazionale"
                  target="_blank"
                  className="text-sm font-weight-semibold text-blue"
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
