import { format } from "date-fns";
import { Button, Icon } from "design-react-kit";
import { Fragment, useMemo, useState } from "react";
import { href, useNavigate } from "react-router";
import { Row } from "react-table";
import {
  Agreement,
  BucketCodeLoadStatus,
  Discount,
  Profile
} from "../../api/generated";
import EditIcon from "../../assets/icons/edit.svg?react";
import TestIcon from "../../assets/icons/magic-wand.svg?react";
import TrashIcon from "../../assets/icons/trashcan.svg?react";
import {
  formatPercentage,
  makeProductCategoriesString
} from "../../utils/strings";
import Callout from "../Callout/Callout";
import MultilanguageProfileItem from "../Profile/MultilanguageProfileItem";
import ProfileItem from "../Profile/ProfileItem";
import ImportationStatus from "./ImportationStatus";
import { DiscountComponent } from "./getDiscountComponent";

type Props = {
  row: Row<Discount>;
  agreement: Agreement;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
  onTest: () => void;
  profile?: Profile;
  maxPublishedDiscountsReached: boolean;
};

const DiscountDetailRow = ({
  row,
  agreement,
  profile,
  onPublish,
  onUnpublish,
  onDelete,
  onTest,
  maxPublishedDiscountsReached
}: Props) => {
  const navigate = useNavigate();
  const [canBePublished, setCanBePublished] = useState(
    row.original.lastBucketCodeLoadStatus
      ? row.original.lastBucketCodeLoadStatus === BucketCodeLoadStatus.Finished
      : true
  );

  const canPublishAfterTest = useMemo(
    () =>
      ((profile && profile.salesChannel.channelType === "OfflineChannel") ||
        row.original.state === "test_passed") &&
      canBePublished,
    [profile, canBePublished, row]
  );

  const getDiscountButtons = (row: Row<Discount>) => (
    <div className={"mt-10 d-flex flex-row justify-content-end"}>
      <Button
        color="danger"
        className="me-2 d-flex align-items-center"
        outline
        icon
        tag="button"
        onClick={onDelete}
      >
        <TrashIcon fill={"#CC334D"} />
        Elimina
      </Button>
      <Button
        className="me-2 d-flex align-items-center"
        color={"primary"}
        outline
        tag="button"
        onClick={() => {
          navigate(
            href("/operator/discount/edit/:discountId", {
              discountId: row.original.id
            })
          );
        }}
      >
        {row.original.state !== "expired" ? (
          <EditIcon fill={"#0273E6"} />
        ) : (
          <Icon
            icon={"it-restore"}
            padding={false}
            size="sm"
            color={"primary"}
          />
        )}
        <span>
          {row.original.state !== "expired" ? "Modifica" : "Riattiva"}
        </span>
      </Button>
      {profile?.salesChannel.channelType !== "OfflineChannel" &&
        (row.original.state === "test_pending" ||
          row.original.state === "test_failed" ||
          row.original.state === "draft") && (
          <Button
            className="me-2 d-flex align-items-center"
            color="primary"
            tag="button"
            outline
            disabled={row.original.state === "test_pending"}
            onClick={onTest}
          >
            <TestIcon fill="#0273E6" />
            <span>Richiedi test</span>
          </Button>
        )}
      {row.original.state !== "published" &&
        row.original.state !== "suspended" &&
        row.original.state !== "expired" && (
          <Button
            className="me-2"
            color="primary"
            tag="button"
            onClick={onPublish}
            disabled={!canPublishAfterTest || maxPublishedDiscountsReached}
          >
            <span>Pubblica</span>
          </Button>
        )}
      {row.original.state === "published" && (
        <Button
          className="me-2"
          color="primary"
          tag="button"
          onClick={onUnpublish}
        >
          <span>Torna in bozza</span>
        </Button>
      )}
    </div>
  );

  return (
    <section className="px-6 py-4 bg-white">
      {row.original.state === "test_failed" && (
        <Callout
          type={"danger"}
          title="IL TEST PER QUESTA OPPORTUNITA' È FALLITO"
          body={row.original.testFailureReason}
        />
      )}
      {row.original.state === "suspended" && (
        <Callout
          type={"danger"}
          title="Questa opportunità è stata sospesa"
          body={
            <Fragment>
              <div>{row.original.suspendedReasonMessage}</div>
              <div>
                <button
                  className="btn btn-link fw-bold p-0 my-2"
                  onClick={() => {
                    navigate(
                      href("/operator/discount/edit/:discountId", {
                        discountId: row.original.id
                      })
                    );
                  }}
                >
                  Modifica opportunità
                </button>
              </div>
            </Fragment>
          }
        />
      )}
      {row.original.lastBucketCodeLoadUid != null &&
        row.original.lastBucketCodeLoadStatus &&
        !canBePublished && (
          <ImportationStatus
            discountId={row.original.id}
            agreementId={agreement.id}
            status={row.original.lastBucketCodeLoadStatus}
            onPollingComplete={() => setCanBePublished(true)}
          />
        )}
      <h1 className="h5 fw-bold text-dark-blue">Dettagli</h1>
      <table className="table">
        <tbody>
          <MultilanguageProfileItem
            label="Nome opportunità"
            value={row.original.name}
            value_en={row.original.name_en}
          />
          {row.original.description && row.original.description_en && (
            <MultilanguageProfileItem
              label="Descrizione opportunità"
              value={row.original.description}
              value_en={row.original.description_en}
            />
          )}
          <tr>
            <td className={`px-0 text-gray border-bottom-0`}>
              Stato opportunità
            </td>
            <td className={`border-bottom-0`}>
              <DiscountComponent discountState={row.values.state} />
            </td>
          </tr>
          <ProfileItem
            label="Data d'inizio opportunità"
            value={format(new Date(row.original.startDate), "dd/MM/yyyy")}
          />
          <ProfileItem
            label="Data di fine opportunità"
            value={format(new Date(row.original.endDate), "dd/MM/yyyy")}
          />
          <ProfileItem
            label="Entità dello sconto"
            value={formatPercentage(row.original.discount)}
          />
          <tr>
            <td className={`px-0 text-gray border-bottom-0`}>
              Categorie merceologiche
            </td>
            <td className={`border-bottom-0`}>
              {makeProductCategoriesString(row.original.productCategories).map(
                (productCategory, index) =>
                  productCategory ? <p key={index}>{productCategory}</p> : null
              )}
            </td>
          </tr>
          {row.original.condition && row.original.condition_en && (
            <MultilanguageProfileItem
              label="Condizioni dell'opportunità"
              value={row.original.condition}
              value_en={row.original.condition_en}
            />
          )}
          {row.original.discountUrl && (
            <ProfileItem
              label="Link all'opportunità"
              value={
                <a
                  href={row.original.discountUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {row.original.discountUrl}
                </a>
              }
            />
          )}
          {row.original.staticCode && (
            <ProfileItem
              label="Codice sconto statico"
              value={row.original.staticCode}
            />
          )}
          {row.original.landingPageUrl && (
            <ProfileItem
              label="Link alla landing page"
              value={row.original.landingPageUrl}
            />
          )}
          {row.original.landingPageReferrer && (
            <ProfileItem
              label="Landing Page referer"
              value={row.original.landingPageReferrer}
            />
          )}
          <ProfileItem
            label="EYCA"
            value={row.original.visibleOnEyca ? "Sì" : "No"}
          />
          {row.original.eycaLandingPageUrl && (
            <ProfileItem
              label="Link EYCA"
              value={
                <a
                  href={row.original.eycaLandingPageUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {row.original.eycaLandingPageUrl}
                </a>
              }
            />
          )}
        </tbody>
      </table>
      {agreement.state === "ApprovedAgreement" && getDiscountButtons(row)}
    </section>
  );
};

export default DiscountDetailRow;
