import Flexbox from "@/components/ui/Flexbox";
import SimpleSpinner from "./components/SimpleSpinner";
import MoreFullSpinner from "./components/MoreFullSpinner";
import DotSpinner from "./components/DotSpinner";

export const SPINNER_SIZE = 60;

export default function AnimationsPage() {
  return (
    <Flexbox
      style={{
        gap: "30px",
        padding: "20px",
        flexWrap: "wrap",
        flexDirection: "row",
      }}
    >
      <SimpleSpinner />
      <MoreFullSpinner />
      <DotSpinner />
    </Flexbox>
  );
}
