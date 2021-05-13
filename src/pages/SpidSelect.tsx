import React from "react";
import { Button, Icon } from "design-react-kit";
import SpidBig from "../assets/icons/spid_big.svg";
import { IDPS } from "../IDPS";

const Login = ({ onBack }: { onBack: () => void }) => {
  const getSPID = (entityID: string) => {
    window.location.replace(
      `${process.env.BASE_SPID_LOGIN_PATH}/login?entityID=${entityID}&authLevel=SpidL2`
    );
  };

  return (
    <section className="p-20 bg-white">
      <div className="mb-10 px-10 d-flex justify-content-between">
        <SpidBig />
        <Icon
          icon="it-close"
          className="cursor-pointer"
          color="primary"
          size="xl"
          onClick={onBack}
        />
      </div>
      <div className="d-flex flex-column align-items-center">
        <h3>Scegli il tuo SPID</h3>
        <div className="row mt-10" style={{ width: "400px" }}>
          {IDPS.identityProviders.map((IP, i) => (
            <div key={i} className="col-6">
              <div
                onClick={() => getSPID(IP.entityId)}
                className="my-2 mx-1 py-2 px-4 d-flex align-items-center justify-content-center cursor-pointer"
                style={{ height: "50px", background: "#FBFBFC" }}
              >
                <img width="100" src={IP.imageUrl} alt={IP.name} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          Non hai SPID?{" "}
          <a href={IDPS.richiediSpid} target="_blank" rel="noreferrer">
            Scopri di più
          </a>
        </div>

        <Button
          type="button"
          color="primary"
          outline
          className="mt-10"
          onClick={onBack}
        >
          Annulla
        </Button>
      </div>
    </section>
  );
};

export default Login;
