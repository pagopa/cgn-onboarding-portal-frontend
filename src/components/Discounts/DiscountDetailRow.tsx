import { format } from "date-fns";
import { Badge, Button, Icon } from "design-react-kit";
import React, { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row } from "react-table";
import { useSelector } from "react-redux";
import {
  BucketCodeLoadStatus,
  Discount,
  DiscountState,
  EntityType,
  Profile
} from "../../api/generated";
import EditIcon from "../../assets/icons/edit.svg";
import TestIcon from "../../assets/icons/magic-wand.svg";
import TrashIcon from "../../assets/icons/trashcan.svg";
import {
  formatPercentage,
  makeProductCategoriesString
} from "../../utils/strings";
import Callout from "../Callout/Callout";
import { RootState } from "../../store/store";
import MultilanguageProfileItem from "../Profile/MultilanguageProfileItem";
import ProfileItem from "../Profile/ProfileItem";
import ImportationStatus from "./ImportationStatus";

type Props = {
  row: Row<Discount>;
  agreement: any;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
  onTest: () => void;
  profile?: Profile;
};

export const getDiscountComponent = (state: DiscountState) => {
  switch (state) {
    case "draft":
      return (
        <Badge
          className="font-weight-normal"
          pill
          tag="span"
          style={{
            backgroundColor: "white",
            color: "#5C6F82",
            border: "1px solid #5C6F82"
          }}
        >
          Bozza
        </Badge>
      );

    case "published":
      return (
        <Badge className="font-weight-normal" color="primary" pill tag="span">
          Pubblicata
        </Badge>
      );

    case "suspended":
      return (
        <Badge
          className="font-weight-normal"
          pill
          tag="span"
          style={{
            backgroundColor: "#EA7614",
            border: "1px solid #EA7614",
            color: "white"
          }}
        >
          Sospesa
        </Badge>
      );

    case "expired":
      return (
        <Badge
          className="font-weight-normal"
          pill
          tag="span"
          style={{
            backgroundColor: "white",
            border: "1px solid #C02927",
            color: "#C02927"
          }}
        >
          Scaduta
        </Badge>
      );

    case "test_pending":
      return (
        <Badge
          className="font-weight-normal"
          pill
          tag="span"
          style={{
            backgroundColor: "white",
            border: "1px solid #EA7614",
            color: "#EA7614"
          }}
        >
          In test
        </Badge>
      );
    case "test_failed":
      return (
        <Badge
          className="font-weight-normal"
          pill
          tag="span"
          style={{
            backgroundColor: "white",
            border: "1px solid #C02927",
            color: "#C02927"
          }}
        >
          Test fallito
        </Badge>
      );
    case "test_passed":
      return (
        <Badge
          className="font-weight-normal"
          pill
          tag="span"
          style={{
            backgroundColor: "white",
            border: "1px solid #008255",
            color: "#008255"
          }}
        >
          Test superato
        </Badge>
      );
  }
};

const DiscountDetailRow = ({
  row,
  agreement,
  profile,
  onPublish,
  onUnpublish,
  onDelete,
  onTest
}: // eslint-disable-next-line sonarjs/cognitive-complexity
Props) => {
  const history = useHistory();
  const [canBePublished, setCanBePublished] = useState(
    row.original.lastBucketCodeLoadStatus !== null &&
      row.original.lastBucketCodeLoadStatus !== undefined
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
        color={"secondary"}
        className={"mr-2 d-flex align-items-center"}
        outline
        icon
        tag="button"
        onClick={onDelete}
      >
        <TrashIcon fill={"#5C6F82"} />
        Elimina
      </Button>
      <Button
        className="mr-2 d-flex align-items-center"
        color={"primary"}
        outline
        tag="button"
        onClick={() =>
          history.push(
            `/admin/operatori/agevolazioni/modifica/${row.original.id}`
          )
        }
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
            className="mr-2 d-flex align-items-center"
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
            className="mr-2"
            color="primary"
            tag="button"
            onClick={onPublish}
            disabled={!canPublishAfterTest}
          >
            <span>Pubblica</span>
          </Button>
        )}
      {row.original.state === "published" && (
        <Button
          className="mr-2"
          color="primary"
          tag="button"
          onClick={onUnpublish}
        >
          <span>Torna in bozza</span>
        </Button>
      )}
    </div>
  );

  const entityType = useSelector(
    (state: RootState) => state.agreement.value?.entityType
  );

  return (
    <>
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
            body={row.original.suspendedReasonMessage}
          />
        )}
        {row.original.lastBucketCodeLoadUid !== null &&
          row.original.lastBucketCodeLoadStatus &&
          !canBePublished && (
            <ImportationStatus
              discountId={row.original.id}
              agreementId={agreement.id}
              status={row.original.lastBucketCodeLoadStatus}
              onPollingComplete={() => setCanBePublished(true)}
            />
          )}
        <h1 className="h5 font-weight-bold text-dark-blue">Dettagli</h1>
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
                {getDiscountComponent(row.values.state)}
              </td>
            </tr>
            <ProfileItem
              label="Data di inizio dell'opportunità"
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
                {makeProductCategoriesString(
                  row.original.productCategories,
                  entityType
                ).map((productCategory, index) =>
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
          </tbody>
        </table>
        {agreement.state === "ApprovedAgreement" && getDiscountButtons(row)}
      </section>
    </>
  );
};

export default DiscountDetailRow;
