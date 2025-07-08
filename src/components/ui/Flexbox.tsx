export default function Flexbox(props: {
  children?: React.ReactNode;
  style: React.CSSProperties;
}) {
  return (
    <div
      style={{
        ...props.style,
        display: "flex",
        gap: "5px",
        flexDirection: "column",
      }}
    >
      {props.children}
    </div>
  );
}
