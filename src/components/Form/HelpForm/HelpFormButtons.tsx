import { Button } from "design-react-kit";
import { Link } from "react-router-dom";
import { DASHBOARD } from "../../../navigation/routes";

type Props = {
  isValid: boolean;
  dirty: boolean;
};

const FormButtons = ({ isValid, dirty }: Props) => (
  <div className="mt-10">
    <Link to={DASHBOARD} className="px-14 me-14 btn btn-outline-primary">
      Annulla
    </Link>
    <Button
      type="submit"
      className="px-14 me-4"
      color="primary"
      disabled={!(isValid && dirty)}
    >
      Invia
    </Button>
  </div>
);

export default FormButtons;
