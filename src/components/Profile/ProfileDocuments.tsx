import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { LinkList, LinkListItem, Icon } from "design-react-kit";
import { useSelector } from "react-redux";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import Api from "../../api";
import { formatDate } from "../../utils/dates";

const ProfileDocuments = () => {
  const [agreementDocument, setAgreementDocument] = useState<any>();
  const [manifestationDocument, setManifestationDocument] = useState<any>();
  const agreement = useSelector((state: any) => state.agreement.value);

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
                document.documentType === "agreeement"
            )
          );
          setManifestationDocument(
            documents.find(
              document =>
                document.documentType ===
                  "backoffice_manifestation_of_interest" ||
                document.documentType === "manifestation_of_interest"
            )
          );
        }
      )
      .run();

  useEffect(() => {
    void getDocuments(agreement.id);
  }, []);

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
                  Approvato il {formatDate(agreementDocument.documentTimestamp)}
                </p>
              </div>
            </LinkListItem>
            <LinkListItem divider tag="a" />
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
                  Allegato 1 - Manifestazione di interesse
                </a>
                <p className="text-sm font-weight-light text-dark-blue">
                  Approvato il
                  {formatDate(manifestationDocument.documentTimestamp)}
                </p>
              </div>
            </LinkListItem>
            <LinkListItem divider tag="a" />
            <LinkListItem
              tag="div"
              className="d-flex flex-row align-items-center"
            >
              <Icon icon="it-file" color="primary" className="mr-4" />
              <div>
                <a
                  href="https://io.italia.it/carta-giovani-nazionale/guida-operatori"
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
