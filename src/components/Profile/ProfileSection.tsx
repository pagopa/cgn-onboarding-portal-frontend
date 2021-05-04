import React from "react";

type Props = {
  className?: string;
  title: string;
  children: any;
};

const ProfileSection = ({ className, title, children }: Props) => (
  <section className={className}>
    <h2 className="h5 font-weight-bold text-dark-blue">{title}</h2>
    {children}
  </section>
);

export default ProfileSection;
