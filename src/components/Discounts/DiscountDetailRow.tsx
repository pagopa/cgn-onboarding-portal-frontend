import React, { useState } from "react";
import { Row } from "react-table";
import {
  Badge,
  Button,
  Callout,
  CalloutText,
  CalloutTitle,
  Icon
} from "design-react-kit";
import { format } from "date-fns";
import { useHistory } from "react-router-dom";
import ProfileItem from "../Profile/ProfileItem";
import {
  formatPercentage,
  makeProductCategoriesString
} from "../../utils/strings";
import { BucketCodeLoadStatus, Discount } from "../../api/generated";
import ImportationStatus from "./ImportationStatus";

type Props = {
  row: Row<Discount>;
  agreement: any;
  onPublish: () => void;
  onDelete: () => void;
};

export const getDiscountComponent = (state: string) => {
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
  }
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const DiscountDetailRow = ({ row, agreement, onPublish, onDelete }: Props) => {
  const history = useHistory();
  const [canBePublished, setCanBePublished] = useState(
    row.original.lastBucketCodeLoadStatus !== null &&
      row.original.lastBucketCodeLoadStatus !== undefined
      ? row.original.lastBucketCodeLoadStatus === BucketCodeLoadStatus.Finished
      : true
  );
  const getDiscountButtons = (row: Row<Discount>) => (
    <div
      className={
        row.original.state !== "suspended" && row.original.state !== "expired"
          ? "mt-10 d-flex flex-row justify-content-between"
          : "mt-10"
      }
    >
      <Button
        className="mr-4"
        color={row.original.state === "expired" ? "primary" : "secondary"}
        outline
        tag="button"
        onClick={() =>
          history.push(
            `/admin/operatori/agevolazioni/modifica/${row.original.id}`
          )
        }
      >
        <Icon
          icon={row.original.state !== "expired" ? "it-pencil" : "it-restore"}
          padding={false}
          size="sm"
          color={row.original.state === "expired" ? "primary" : ""}
        />
        <span>
          {row.original.state !== "expired" ? "Modifica" : "Riattiva"}
        </span>
      </Button>
      <Button
        color={row.original.state !== "expired" ? "primary" : "secondary"}
        className={row.original.state === "expired" ? "mr-4" : ""}
        outline
        icon
        tag="button"
        onClick={onDelete}
      >
        <Icon
          icon="it-delete"
          color={row.original.state !== "expired" ? "primary" : "secondary"}
          padding={false}
          size="sm"
        />{" "}
        Elimina
      </Button>
      {row.original.state !== "published" &&
        row.original.state !== "suspended" &&
        row.original.state !== "expired" && (
          <Button
            className="mr-4"
            color="primary"
            tag="button"
            onClick={onPublish}
            disabled={!canBePublished}
          >
            <Icon
              icon={"it-external-link"}
              color="white"
              padding={false}
              size="sm"
            />{" "}
            <span>Pubblica</span>
          </Button>
        )}
    </div>
  );

  return (
    <>
      <section className="px-6 py-4 bg-white">
        {row.original.state === "suspended" && (
          <Callout
            highlight
            tag="div"
            style={{
              borderLeftColor: "#ea7614"
            }}
          >
            <CalloutTitle tag="div" className="py-2 text-base text-black">
              Questa agevolazione è stata sospesa dal Dipartimento
            </CalloutTitle>
            <CalloutText
              bigText={false}
              tag="p"
              className="py-2 text-base text-dark-gray"
            >
              {row.original.suspendedReasonMessage}
            </CalloutText>
          </Callout>
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
            <ProfileItem label="Nome agevolazione" value={row.original.name} />
            {row.original.description && (
              <ProfileItem
                label="Descrizione agevolazione"
                value={row.original.description}
              />
            )}
            <tr>
              <td className={`px-0 text-gray border-bottom-0`}>
                Stato Agevolazione
              </td>
              <td className={`border-bottom-0`}>
                {getDiscountComponent(row.values.state)}
              </td>
            </tr>
            <ProfileItem
              label="Data di inizio dell'agevolazione"
              value={format(new Date(row.original.startDate), "dd/MM/yyyy")}
            />
            <ProfileItem
              label="Data di fine agevolazione"
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
                  row.original.productCategories
                ).map((productCategory, index) => (
                  <p key={index}>{productCategory}</p>
                ))}
              </td>
            </tr>
            {row.original.condition && (
              <ProfileItem
                label="Condizioni dell’agevolazione"
                value={row.original.condition}
              />
            )}
          </tbody>
        </table>
        {agreement.state === "ApprovedAgreement" && getDiscountButtons(row)}
      </section>
    </>
  );
};

export default DiscountDetailRow;