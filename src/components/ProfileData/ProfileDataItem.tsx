import { TableCell, TableRow } from "@mui/material";
import { ValueLabel } from "../../utils/ValueLabel";

const ProfileDataItem = ({ label, value }: ValueLabel) => (
  <TableRow>
    <TableCell>{label}</TableCell>
    <TableCell>{value}</TableCell>
  </TableRow>
);

export default ProfileDataItem;
