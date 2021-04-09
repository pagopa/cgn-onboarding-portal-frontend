import React from "react";
import InfoCircle from "../assets/icons/info-circle.svg";
import ActivitiesItem from "./ActivitiesItem";

function Activities() {
  return (
    <section>
      <header>
        <div className="d-flex justify-content-between">
          <h1 className="text-title text-uppercase font-weight-semibold tracking">
            Attività
          </h1>
          <InfoCircle />
        </div>
        <p className="text-title">
          Questa è la lista della attività
          <br /> richieste agli operatori per aderire
          <br /> all’iniziativa
        </p>
      </header>
      <div className="d-flex flex-column">
        <ActivitiesItem
          title="Compila i Dati Operatore"
          description="Inserisci i dati di contatto e la descrizione dei beni e servizi offerti"
          checked={true}
        />
        <ActivitiesItem
          title="Inserisci un’agevolazione"
          description="Descrivi almeno una delle offerte destinate ai titolari di CGN"
          checked={false}
        />
        <ActivitiesItem
          title="Compila, firma e carica i documenti"
          description="Scarica, compila e firma i documenti. Poi caricali sul portale"
          checked={false}
        />
      </div>
    </section>
  );
}

export default Activities;
