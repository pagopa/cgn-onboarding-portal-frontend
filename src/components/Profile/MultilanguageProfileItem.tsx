import { TableCell, TableRow } from "@mui/material";

type Props = {
  label: string;
  value: string | React.ReactNode;
  value_en: string | React.ReactNode;
};

const MultilanguageProfileItem = ({ label, value, value_en }: Props) => (
  <TableRow>
    <TableCell sx={{ paddingLeft: 0, color: "#5C6F82", borderBottom: "none" }}>
      {label}
    </TableCell>
    <TableCell sx={{ borderBottom: "none", fontSize: "1rem" }}>
      <p>Italiano 🇮🇹</p>
      {value}
      <p>Inglese 🇬🇧</p>
      {value_en}
    </TableCell>
  </TableRow>
);

export default MultilanguageProfileItem;
