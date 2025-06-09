import { ValueLabel } from "../../utils/ValueLabel";

const ProfileDataItem = ({ label, value }: ValueLabel) => (
  <tr>
    <td className="px-0 border-bottom-0">{label}</td>
    <td className="text-gray border-bottom-0">{value}</td>
  </tr>
);

export default ProfileDataItem;
