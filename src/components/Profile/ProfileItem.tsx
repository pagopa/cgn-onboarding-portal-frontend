type Props = {
  label: string;
  value: string | React.ReactNode;
};

const ProfileItem = ({ label, value }: Props) => (
  <tr>
    <td
      style={{
        width: "400px",
        paddingLeft: 0,
        color: "#5C6F82",
        borderBottom: "none"
      }}
    >
      {label}
    </td>
    <td
      style={{
        maxWidth: "250px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        borderBottom: "none"
      }}
    >
      {value}
    </td>
  </tr>
);

export default ProfileItem;
