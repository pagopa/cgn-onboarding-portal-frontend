import React from "react";

const ProfileDataItem = ({ label, value }: any) => (
  <tr>
    <td className=" border-bottom-0">{label}</td>
    <td className="text-gray border-bottom-0">{value}</td>
  </tr>
);

export default ProfileDataItem;
