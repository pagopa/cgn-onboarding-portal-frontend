const Item = ({
  label,
  value
}: {
  label: string;
  value?: string | number | React.ReactNode;
}) => (
  <div className="row mb-5">
    <div className="col-4 text-gray">{label}</div>
    <div
      className="col-8"
      style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}
    >
      {value}
    </div>
  </div>
);

export default Item;
