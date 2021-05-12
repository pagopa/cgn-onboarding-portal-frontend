import React from "react";

type Props = {
  className?: string;
  label: string;
  value: any;
};

const ProfileItem = ({ className = "", label, value }: Props) => (
  <tr>
    <td className={`${className} px-0 text-gray border-bottom-0`}>{label}</td>
    <td className={`${className} border-bottom-0`}>{value}</td>
  </tr>
);

export default ProfileItem;
