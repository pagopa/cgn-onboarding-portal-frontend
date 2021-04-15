import React from "react";
import Paragraph from "../Paragraph/Paragraph";
import IntroductionTabs from "./IntroductionTabs";

type Props = {
  name: string;
};

const Introduction = ({ name }: Props) => (
  <section className="bg-white text-left">
    <div className="pl-8 pt-10">
      <h1 className="h5">Carta Giovani Nazionale</h1>
      <h2 className="h2 text-dark-blue font-weight-bold">Portale Operatori</h2>
      <Paragraph color="dark-blue">{name}</Paragraph>
    </div>
    <IntroductionTabs />
  </section>
);

export default Introduction;
