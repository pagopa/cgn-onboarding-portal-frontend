import { Spinner } from "design-react-kit";

const SmallSpinner = () => (
  <div className="position-relative">
    <div
      className="position-absolute top-50 ms-5 translate-middle-y "
      style={{ right: 10 }}
    >
      <Spinner active small />
    </div>
  </div>
);

export default SmallSpinner;
