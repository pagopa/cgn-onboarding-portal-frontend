const IDPS = {
  identityProviders: [
    {
      identifier: "AgID",
      entityId: "idp.spid.gov.it",
      name: "AgID IdP test",
      imageUrl:
        "https://raw.githubusercontent.com/AgID/italia-conf/master/assets/images/logo-agid.png"
    },
    {
      identifier: "Aruba",
      entityId: "https://loginspid.aruba.it",
      name: "Aruba.it ID",
      imageUrl:
        "https://www.spid.gov.it/assets/img/richiedi-spid/logo-aruba.svg"
    },
    {
      identifier: "Infocert",
      entityId: "https://identity.infocert.it",
      name: "Infocert ID",
      imageUrl:
        "https://www.spid.gov.it/assets/img/richiedi-spid/logo-infocert.svg"
    },
    {
      identifier: "Namirial",
      entityId: "https://idp.namirialtsp.com/idp",
      name: "Namirial ID",
      imageUrl:
        "https://www.spid.gov.it/assets/img/richiedi-spid/logo-namirial.svg"
    },
    {
      identifier: "Poste",
      entityId: "https://posteid.poste.it",
      name: "Poste ID",
      imageUrl:
        "https://www.spid.gov.it/assets/img/richiedi-spid/logo-poste.svg"
    },
    {
      identifier: "Register",
      entityId: "https://spid.register.it",
      name: "SpidItalia",
      imageUrl:
        "https://www.spid.gov.it/assets/img/richiedi-spid/logo-register.svg"
    },
    {
      identifier: "Sielte",
      entityId: "https://identity.sieltecloud.it",
      name: "Sielte id",
      imageUrl:
        "https://www.spid.gov.it/assets/img/richiedi-spid/logo-sielte.svg"
    },
    {
      identifier: "Tim",
      entityId: "https://login.id.tim.it/affwebservices/public/saml2sso",
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