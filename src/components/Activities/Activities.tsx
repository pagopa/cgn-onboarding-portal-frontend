import React from "react";
import InfoCircle from "../../assets/icons/info-circle.svg";
import ActivitiesItem from "./ActivitiesItem";

const Activities = () => (
  <section className="bg-white">
    <header className="pr-6 pt-6 pl-6">
      <div className="d-flex justify-content-between">
        <h1 className="text-title text-uppercase font-weight-semibold tracking">
          Attività
        </h1>
        <InfoCircle />
      </div>
      <p className="text-sm mb-0">
        Questa è la lista della attività richieste agli operatori per aderire
        all’iniziativa
      </p>
    </header>
    <div className="d-flex flex-column">
      <ActivitiesItem
        title="Compila i dati Operatore"
        description="Inserisci i dati di contatto e la descrizione dei beni e servizi offerti"
        checked
        hasBorderBottom
      />
      <ActivitiesItem
        title="Inserisci un’agevolazione"
        description="Descrivi almeno una delle offerte destinate ai titolari di CGN"
        checked={false}
        hasBorderBottom
      />
      <ActivitiesItem
        title="Compila, firma e carica i documenti"
        description="Scarica, compila e firma i documenti. Poi caricali sul portale"
        checked={false}
        hasBorderBottom={false}
      />
    </div>
  </section>
);

export default Activities;
