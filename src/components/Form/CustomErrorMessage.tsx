import { ErrorMessage } from "formik";

type Props = {
  name: string;
};
const CustomErrorMessage = ({ name }: Props) => (
  <ErrorMessage name={name} component="span" className="text-red" />
);

export default CustomErrorMessage;
