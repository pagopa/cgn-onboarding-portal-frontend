import React from "react";
import { Link } from "react-router-dom";
import { CREATE_PROFILE } from "../../navigation/routes";
import Paragraph from "../Paragraph/Paragraph";

const Tutorial = () => (
  <section className="mt-2 py-20 bg-white text-center">
    <h1 className="h4 font-weight-bold text-dark-blue">
      Per iniziare, compila i tuoi dati operatore
    </h1>
    <Paragraph color="gray">
      Una volta compilati i dati, potrai aggiungere le tue agevolazioni
    </Paragraph>
    <Link to={CREATE_PROFILE} className="btn btn-outline-primary mt-9 px-14">
      Compila i dati
    </Link>
  </section>
);

export default Tutorial;
