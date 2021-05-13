const IDPS = {
  identityProviders: [
    {
      identifier: "Aruba",
      entityId: "arubaid",
      name: "Aruba.it ID",
      imageUrl:
        "https://www.spid.gov.it/assets/img/richiedi-spid/logo-aruba.svg"
    },
    {
      identifier: "Poste",
      entityId: "posteid",
      name: "Poste ID",
      imageUrl:
        "https://www.spid.gov.it/assets/img/richiedi-spid/logo-poste.svg"
    },
    {
      identifier: "Infocert",
      entityId: "infocertid",
      name: "Infocert ID",
      imageUrl:
        "https://www.spid.gov.it/assets/img/richiedi-spid/logo-infocert.svg"
    },
    {
      identifier: "Register",
      entityId: "spiditalia",
      name: "SpidItalia",
      imageUrl:
        "https://www.spid.gov.it/assets/img/richiedi-spid/logo-register.svg"
    },
    {
      identifier: "IntesaID",
      entityId: "intesaid",
      name: "Intesa",
      imageUrl:
        "https://www.spid.gov.it/assets/img/richiedi-spid/logo-intesa.svg"
    },
    {
      identifier: "Sielte",
      entityId: "sielteid",
      name: "Sielte id",
      imageUrl:
        "https://www.spid.gov.it/assets/img/richiedi-spid/logo-sielte.svg"
    },
    {
      identifier: "Namirial",
      entityId: "namirialid",
      name: "Namirial ID",
      imageUrl:
        "https://www.spid.gov.it/assets/img/richiedi-spid/logo-namirial.svg"
    },
    {
      identifier: "Tim",
      entityId: "timid",
      name: "TIM id",
      imageUrl: "https://www.spid.gov.it/assets/img/richiedi-spid/logo-tim.svg"
    }
  ],
  richiediSpid: "https://www.spid.gov.it/richiedi-spid"
};

if (process.env.NODE_ENV !== 'production') {
// eslint-disable-next-line functional/immutable-data
  IDPS.identityProviders.push({
    identifier: "test",
    entityId: "xx_testenv2",
    name: "test",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/11/Test-Logo.svg"
  });
}

export {
  IDPS
};