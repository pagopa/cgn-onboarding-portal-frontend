import React from "react";

type Props = {
  className?: string;
  label: string;
  value: string | React.ReactNode;
  value_en: string | React.ReactNode;
};

const MultilanguageProfileItem = ({
  className = "",
  label,
  value,
  value_en
}: Props) => (
  <tr>
    <td className={`${className} px-0 text-gray border-bottom-0`}>{label}</td>
    <td className={`${className} border-bottom-0 text-base`}>
      <p className="text-sm font-weight-normal text-gray mb-0">Italiano 🇮🇹</p>
      {value}
      <p className="text-sm font-weight-normal text-gray mb-0 mt-3">
        Inglese 🇬🇧
      </p>
      {value_en}
    </td>
  </tr>
);

export default MultilanguageProfileItem;
