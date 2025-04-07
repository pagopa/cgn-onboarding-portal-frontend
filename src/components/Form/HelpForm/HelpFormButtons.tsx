import { Button } from "design-react-kit";
import React from "react";
import { Link } from "react-router-dom";
import { DASHBOARD } from "../../../navigation/routes";

const FormButtons = () => (
  <div className="mt-10">
    <Link to={DASHBOARD} className="px-14 mr-14 btn btn-outline-primary">
      Annulla
    </Link>
    <Button type="submit" className="px-14 mr-4" color="primary">
      Invia
    </Button>
  </div>
);

export default FormButtons;
