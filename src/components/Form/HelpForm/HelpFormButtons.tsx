import { Link } from "react-router-dom";
import { DASHBOARD } from "../../../navigation/routes";
import AsyncButton from "../../AsyncButton/AsyncButton";

type Props = { isPending: boolean };

const FormButtons = ({ isPending }: Props) => (
  <div className="mt-10">
    <Link to={DASHBOARD} className="px-14 me-14 btn btn-outline-primary">
      Annulla
    </Link>
    <AsyncButton
      type="submit"
      tag="button"
      className="px-14 me-4"
      color="primary"
      isPending={isPending}
    >
      Invia
    </AsyncButton>
  </div>
);

export default FormButtons;
