import React from "react";

type Props = {
  className?: string;
  label: string;
  value: string;
};

const ProfileSectionItem = ({ className, label, value }: Props) => (
  <div className={`${className} row mt-7`}>
    <div className="col">
      <span className="text-base font-weight-normal text-gray">{label}</span>
    </div>
    <div className="col">{value}</div>
  </div>
);

export default ProfileSectionItem;
