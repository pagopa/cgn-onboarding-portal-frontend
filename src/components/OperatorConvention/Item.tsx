const Item = ({
  label,
  value
}: {
  label: string;
  value?: string | number | React.ReactNode;
}) => (
  <div>
    <div>{label}</div>
    <div style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}>
      {value}
    </div>
  </div>
);

export default Item;
