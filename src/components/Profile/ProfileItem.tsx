type Props = {
  className?: string;
  label: string;
  value: string | React.ReactNode;
};

const ProfileItem = ({ className = "", label, value }: Props) => (
  <tr>
    <td className={`${className} px-0 text-gray border-bottom-0`}>{label}</td>
    <td
      className={`${className} border-bottom-0`}
      style={{
        maxWidth: "250px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}
    >
      {value}
    </td>
  </tr>
);

export default ProfileItem;
