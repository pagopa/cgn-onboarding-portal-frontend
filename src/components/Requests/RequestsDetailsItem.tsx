const RequestsItem = ({
  label,
  value
}: {
  label: string;
  value: string | number | undefined;
}) => (
  <div>
    <div>{label}</div>
    <div>{value}</div>
  </div>
);

export default RequestsItem;
