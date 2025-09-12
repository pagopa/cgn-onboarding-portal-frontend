import { Button } from "design-react-kit";
import { Link, href } from "react-router";

const FormButtons = ({ isEnabled }: { isEnabled: boolean }) => (
  <div className="mt-10">
    <Link to={href("/")} className="px-14 me-14 btn btn-outline-primary">
      Annulla
    </Link>
    <Button
      type="submit"
      className="px-14 me-4"
      color="primary"
      disabled={!isEnabled}
    >
      Invia
    </Button>
  </div>
);

export default FormButtons;
