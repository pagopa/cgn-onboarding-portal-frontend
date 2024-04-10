import { fromNullable } from "fp-ts/lib/Option";
import {
  ProductCategory,
  EntityType as EntityTypeA,
  EntityType
} from "../api/generated";
import {
  OrganizationStatus,
  EntityType as EntityTypeB
} from "../api/generated_backoffice";

type CategoryElement = {
  name: string;
  description: string;
};

export function categoriesMap(
  entityType: EntityType | undefined
): Record<ProductCategory, CategoryElement> {
  return {
    CultureAndEntertainment: {
      name: "Cultura e tempo libero",
      description:
        "(Libri, teatro, cinema, concerti, CD, dischi, cibo, bevande, ristoranti, shopping)"
    },
    Learning: {
      name: "Istruzione e formazione",
      description: "(Scuole,Università, Corsi di formazione, ...)"
    },
    Health: {
      name: "Salute e benessere",
      description: "(Negozi di cosmetici, creme, cliniche, SPA, ...)"
    },
    Sports: {
      name: "Sport",
      description:
        "(Negozi di articoli sportivi, strutture sportive, circoli, ...)"
    },
    Home: {
      name: "Casa",
      description: (() => {
        switch (entityType) {
          case EntityType.Private:
            return "(Opportunità per la casa, mutui, gestori luce e gas, ...)";
          default:
          case EntityType.PublicAdministration:
            return "(Agevolazioni per la casa, mutui, gestori luce e gas, ...)";
        }
      })()
    },
    TelephonyAndInternet: {
      name: "Telefonia e internet",
      description: "(Linea fissa e internet, telefonia mobile, ecc)"
    },
    BankingServices: {
      name: "Servizi finanziari",
      description: "(Banche, app di investimenti o di risparmio)"
    },
    Travelling: {
      name: "Viaggi e Trasporti",
      description: "(Agenzie di viaggio, compagnie di trasporti, ...)"
    },
    SustainableMobility: {
      name: "Mobilità sostenibile",
      description:
        "(Servizi per muoversi in città, car sharing, monopattini, bici, trasporti green, ...)"
    },
    JobOffers: {
      name: "Lavoro e tirocini",
      description: "(Concorsi, offerte di lavoro)"
    }
  };
}

const organizationStatusMap: Record<OrganizationStatus, string> = {
  [OrganizationStatus.Draft]: "In Bozza",
  [OrganizationStatus.Enabled]: "Abilitato",
  [OrganizationStatus.Active]: "Convenzionato",
  [OrganizationStatus.Pending]: "Da valutare"
};

export const makeOrganizationStatusReadable = (status: OrganizationStatus) =>
  fromNullable(organizationStatusMap[status]).fold("", s => s);

export const makeProductCategoriesString = (
  productCategories: Array<ProductCategory>,
  entityType: EntityType | undefined
): Array<string | undefined> =>
  productCategories.map(pc =>
    categoriesMap(entityType)[pc]
      ? categoriesMap(entityType)[pc].name
      : undefined
  );

export const formatPercentage = (discountValue: number | undefined) =>
  fromNullable(discountValue)
    .map(value => `${value} %`)
    .getOrElse("");

export const withNormalizedSpaces = (value?: string) =>
  value ? value.replace(/(\r\n|\n|\r)/gm, " ").trim() : "";

export const clearIfReferenceIsBlank = (reference?: string) => (
  value?: string
) =>
  withNormalizedSpaces(reference).length <= 0
    ? ""
    : withNormalizedSpaces(value);

export function getEntityTypeLabel(
  entityType: EntityTypeA | EntityTypeB | undefined
) {
  switch (entityType) {
    case EntityTypeA.Private:
    case EntityTypeB.Private:
      return "Privato";
    default:
    case EntityTypeA.PublicAdministration:
    case EntityTypeB.PublicAdministration:
      return "Pubblico";
  }
}
