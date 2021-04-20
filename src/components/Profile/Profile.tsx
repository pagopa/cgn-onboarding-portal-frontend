import React from "react";
import ProfileSection from "./ProfileSection";
import ProfileSectionItem from "./ProfileSectionItem";

const Profile = () => (
  <section className="mt-2 px-8 py-10 bg-white">
    <ProfileSection
      className="border-bottom"
      title="Dati relativi all'operatore"
    >
      <ProfileSectionItem
        label="Ragione sociale operatore"
        value="PagoPA S.p.A"
      />
      <ProfileSectionItem label="Nome Operatore visualizzato" value="PagoPA" />
      <ProfileSectionItem
        label="Codice Fiscale / Partita IVA"
        value="15376371000"
      />
      <ProfileSectionItem label="Indirizzo PEC" value="PagoPA@pec.it" />
      <ProfileSectionItem
        className="mb-8"
        label="Descrizione dell'operatore"
        value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis dictum mi. Morbi auctor nibh ante, eget interdum urna malesuada in. Suspendisse at condimentum leo."
      />
    </ProfileSection>
    <ProfileSection
      className="mt-8 border-bottom"
      title="Dati del referento incaricato"
    >
      <ProfileSectionItem label="Nome" value="Mario" />
      <ProfileSectionItem label="Cognome" value="Rossi" />
      <ProfileSectionItem
        label="Indirizzo e-mail"
        value="mariorossi@gmail.com"
      />
      <ProfileSectionItem
        className="mb-8"
        label="Numero di telefono"
        value="347 9867145"
      />
    </ProfileSection>

    <ProfileSection className="mt-8" title="Descrizione operatore">
      <ProfileSectionItem label="Categorie merceologiche" value="Viaggi " />
      <ProfileSectionItem label="Sito web" value="www.pagopa.gov.it" />
      <ProfileSectionItem
        label="Indirizzo"
        value="Piazza Colonna 370, Roma, CAP 00187"
      />
      <ProfileSectionItem
        className="mb-8"
        label="Immagine operatore"
        value=""
      />
    </ProfileSection>
  </section>
);

export default Profile;
