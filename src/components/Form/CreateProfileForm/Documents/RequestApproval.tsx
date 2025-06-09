import { Button } from "design-react-kit";
import { Link } from "react-router-dom";
import Hourglass from "../../../../assets/icons/hourglass.svg?react";
import { DASHBOARD } from "../../../../navigation/routes";

const RequestApproval = () => (
  <section className="fixed-top vw-100 vh-100">
    <div className="bg-white px-28 py-16 d-flex align-items-center flex-column h-100 justify-content-center">
      <h1 className="mb-5">Richiesta di convenzione inviata</h1>
      <Hourglass />
      <div className="mt-5 mb-5">
        La tua richiesta è in attesa di approvazione.
        <br />
        Il referente riceverà una e-mail appena sarà approvata.
      </div>
      <Link to={DASHBOARD}>
        <Button className="px-14 me-4" color="primary" outline tag="button">
          Esci
        </Button>
      </Link>
    </div>
  </section>
);
export default RequestApproval;
