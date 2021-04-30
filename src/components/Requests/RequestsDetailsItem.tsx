import React from "react";

const RequestsItem = ({ label, value }: any) => (
  <div className="row mb-5">
    <div className="col-4 text-gray">{label}</div>
    <div className="col-8">{value}</div>
  </div>
);

export default RequestsItem;
