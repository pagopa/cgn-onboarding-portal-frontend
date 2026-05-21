type Props = {
  label: string;
  value: string | React.ReactNode;
  value_en: string | React.ReactNode;
};

const MultilanguageProfileItem = ({ label, value, value_en }: Props) => (
  <tr>
    <td style={{ paddingLeft: 0, color: "#5C6F82", borderBottom: "none" }}>
      {label}
    </td>
    <td style={{ borderBottom: "none", fontSize: "1rem" }}>
      <p>Italiano 🇮🇹</p>
      {value}
      <p>Inglese 🇬🇧</p>
      {value_en}
    </td>
  </tr>
);

export default MultilanguageProfileItem;
