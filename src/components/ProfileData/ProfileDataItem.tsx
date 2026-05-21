import { ValueLabel } from "../../utils/ValueLabel";

const ProfileDataItem = ({ label, value }: ValueLabel) => (
  <tr>
    <td>{label}</td>
    <td>{value}</td>
  </tr>
);

export default ProfileDataItem;
