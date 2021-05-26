import React from "react";
import { Button } from "design-react-kit";
import Hourglass from "../../../../assets/icons/hourglass.svg";

const RequestApproval = () => (
  <section className="request-approval">
    <div className="bg-white px-28 py-16 d-flex align-items-center flex-column h-100 justify-content-center">
      <h1 className="mb-5">Richiesta di convenzione inviata</h1>
      <Hourglass />
      <div className="mt-5 mb-5">
        La vostra richiesta è in attesa di approvazione.
        <br />
        Riceverete una e-mail non appena sarà approvata.
      </div>
      <Button
        className="px-14 mr-4"
        color="primary"
        outline
        tag="button"
        onClick={() => window.location.replace("/")}
      >
        Esci
      </Button>
    </div>
  </section>
);

export default RequestApproval;
