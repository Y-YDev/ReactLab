import { useMemo, useState } from "react";
import { Text } from "@chakra-ui/react";
import DorSlider from "@/components/ui/DorSlider";
import Flexbox from "@/components/ui/Flexbox";
import { SPINNER_SIZE } from "../AnimationsPage";

export default function SimpleSpinner() {
  const [speed, setSpeed] = useState(2); // seconds

  const spinnerStyle = useMemo(
    () => ({
      border: `${SPINNER_SIZE / 7.5}px solid #f3f3f3`,
      borderTop: `${SPINNER_SIZE / 7.5}px solid #3498db`,
      borderRadius: "50%",
      width: SPINNER_SIZE,
      height: SPINNER_SIZE,
      animation: `spin ${speed}s linear infinite`,
    }),
    [speed]
  );

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <Flexbox
      style={{
        flexDirection: "column",
        gap: "10px",
        width: "270px",
        alignItems: "center",
      }}
    >
      {/* Inject keyframes directly into the DOM */}
      <style>{keyframes}</style>
      <div style={spinnerStyle} />
      <Text>Simple spinner - Speed: {speed}s</Text>
      <DorSlider
        width="150px"
        max={4}
        value={[speed]}
        onValueChange={(details) => setSpeed(details.value[0])}
        min={0.2}
        step={0.1}
      />
    </Flexbox>
  );
}
