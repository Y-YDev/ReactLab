export default function Flexbox(props: {
  children?: React.ReactNode;
  style: React.CSSProperties;
}) {
  return (
    <div
      style={{
        ...props.style,
        display: "flex",
        gap: props.style.gap ?? "5px",
        flexDirection: props.style.flexDirection ?? "column",
      }}
    >
      {props.children}
    </div>
  );
}
