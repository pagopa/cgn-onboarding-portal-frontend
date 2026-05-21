import { TableCell, TableRow } from "@mui/material";

type Props = {
  label: string;
  value: string | React.ReactNode;
};

const ProfileItem = ({ label, value }: Props) => (
  <TableRow>
    <TableCell
      sx={{
        width: "400px",
        paddingLeft: 0,
        color: "#5C6F82",
        borderBottom: "none"
      }}
    >
      {label}
    </TableCell>
    <TableCell
      sx={{
        maxWidth: "250px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        borderBottom: "none"
      }}
    >
      {value}
    </TableCell>
  </TableRow>
);

export default ProfileItem;
