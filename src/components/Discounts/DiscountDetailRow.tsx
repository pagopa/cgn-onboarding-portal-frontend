import { format } from "date-fns";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@mui/material";
import { Fragment, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row } from "@tanstack/react-table";
import RestoreIcon from "@mui/icons-material/Restore";
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
import { getEditDiscountRoute } from "../../navigation/utils";
import { getDiscountTypeChecks } from "../../utils/formChecks";
import AsyncButton from "../AsyncButton/AsyncButton";
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
  isPendingPublish: boolean;
  isPendingUnpublish: boolean;
  isPendingTest: boolean;
  isPendingDelete: boolean;
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
  isPendingPublish,
  isPendingUnpublish,
  isPendingTest,
  isPendingDelete,
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
    <Box
      sx={{
        mt: 5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
      }}
    >
      <AsyncButton
        color="error"
        sx={{ mr: 1, display: "flex", alignItems: "center" }}
        variant="outlined"
        loading={isPendingDelete}
        onClick={onDelete}
      >
        <TrashIcon fill={"#CC334D"} />
        Elimina
      </AsyncButton>
      <Button
        sx={{ mr: 1, display: "flex", alignItems: "center" }}
        color={"primary"}
        variant="outlined"
        type="button"
        onClick={() => navigate(getEditDiscountRoute(row.original.id))}
      >
        {row.original.state !== "expired" ? (
          <EditIcon fill={"#0273E6"} />
        ) : (
          <RestoreIcon sx={{ color: "#0273E6" }} />
        )}
        <span>
          {row.original.state !== "expired" ? "Modifica" : "Riattiva"}
        </span>
      </Button>
      {profile?.salesChannel.channelType !== "OfflineChannel" &&
        (row.original.state === "test_pending" ||
          row.original.state === "test_failed" ||
          row.original.state === "draft") && (
          <AsyncButton
            sx={{ mr: 1, display: "flex", alignItems: "center" }}
            variant="outlined"
            disabled={row.original.state === "test_pending"}
            onClick={onTest}
            loading={isPendingTest}
          >
            <TestIcon fill="#0273E6" />
            <span>Richiedi test</span>
          </AsyncButton>
        )}
      {row.original.state !== "published" &&
        row.original.state !== "suspended" &&
        row.original.state !== "expired" && (
          <AsyncButton
            sx={{ mr: 1 }}
            onClick={onPublish}
            disabled={!canPublishAfterTest || maxPublishedDiscountsReached}
            loading={isPendingPublish}
          >
            <span>Pubblica</span>
          </AsyncButton>
        )}
      {row.original.state === "published" && (
        <AsyncButton
          sx={{ mr: 1 }}
          onClick={onUnpublish}
          loading={isPendingUnpublish}
        >
          <span>Torna in bozza</span>
        </AsyncButton>
      )}
    </Box>
  );

  const { checkLanding } = getDiscountTypeChecks(profile);

  return (
    <section style={{ backgroundColor: "white", padding: "1.5rem" }}>
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
                  onClick={() => {
                    navigate(getEditDiscountRoute(row.original.id));
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
      <h1>Dettagli</h1>
      <Table>
        <TableBody>
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
          <TableRow>
            <TableCell
              sx={{ paddingLeft: 0, color: "#5C6F82", borderBottom: "none" }}
            >
              Stato opportunità
            </TableCell>
            <TableCell sx={{ borderBottom: "none" }}>
              <DiscountComponent discountState={row.original.state} />
            </TableCell>
          </TableRow>
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
          <TableRow>
            <TableCell
              sx={{ paddingLeft: 0, color: "#5C6F82", borderBottom: "none" }}
            >
              Categorie merceologiche
            </TableCell>
            <TableCell sx={{ borderBottom: "none" }}>
              {makeProductCategoriesString(row.original.productCategories).map(
                (productCategory, index) =>
                  productCategory ? <p key={index}>{productCategory}</p> : null
              )}
            </TableCell>
          </TableRow>
          {row.original.condition && row.original.condition_en && (
            <MultilanguageProfileItem
              label="Condizioni dell'opportunità"
              value={row.original.condition}
              value_en={row.original.condition_en}
            />
          )}
          {row.original.discountUrl && !checkLanding && (
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
        </TableBody>
      </Table>
      {agreement.state === "ApprovedAgreement" && getDiscountButtons(row)}
    </section>
  );
};

export default DiscountDetailRow;
