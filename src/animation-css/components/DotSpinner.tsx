import { useState, useMemo } from "react";
import Flexbox from "@/components/ui/Flexbox";
import DorSlider from "@/components/ui/DorSlider";
import { Text } from "@chakra-ui/react";

function generateLoaderKeyframes({
  steps = 8,
  distance = 2.6,
  fadeLevels = [
    "#ffffff", // active
    "rgba(255,255,255,0.7)", // near active
    "rgba(255,255,255,0.5)", // further away
    "rgba(255,255,255,0.2)", // far away
  ],
}) {
  const frames: Record<string, string> = {};

  for (let step = 0; step < steps; step++) {
    const percent = (step / steps) * 100;
    const shadows: string[] = [];

    for (let dot = 0; dot < steps; dot++) {
      // Position around the circle
      const angle = (dot / steps) * (Math.PI * 2);
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      // Determine how far this dot is from the active one
      const diff = (dot - step + steps) % steps;
      const colorIndex = Math.min(diff, steps - diff);

      // Get color or fallback to last fadeLevel
      const color = fadeLevels[colorIndex] ?? fadeLevels[fadeLevels.length - 1];

      shadows.push(`${x.toFixed(2)}em ${y.toFixed(2)}em 0 0em ${color}`);
    }

    frames[`${percent}%`] = `box-shadow: ${shadows.join(", ")};`;
  }

  frames["100%"] = frames["0%"];

  return `
    @keyframes dynamicLoader {
      ${Object.entries(frames)
        .map(([percent, value]) => `${percent} { ${value} }`)
        .join("\n")}
    }
  `;
}

export default function DotSpinner() {
  const [speed, setSpeed] = useState(2);
  const [dotNb, setDotNb] = useState(8);

  const keyframes = useMemo(
    () =>
      generateLoaderKeyframes({
        steps: dotNb,
        distance: 2.6,
      }),
    [dotNb]
  );

  const spinnerStyle: React.CSSProperties = useMemo(
    () => ({
      fontSize: "10px",
      width: "1em",
      height: "1em",
      borderRadius: "50%",
      position: "relative",
      textIndent: "-9999em",
      transform: "translateZ(0)",
      animation: `dynamicLoader ${speed}s infinite ease`,
      marginTop: "20px",
      marginBottom: "20px",
    }),
    [speed]
  );

  return (
    <Flexbox
      style={{
        flexDirection: "column",
        gap: "10px",
        width: "270px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <style>{keyframes}</style>
      <div style={spinnerStyle} />
      <Text>Speed: {speed.toFixed(1)}s</Text>
      <DorSlider
        width="150px"
        max={4}
        value={[speed]}
        onValueChange={(details) => setSpeed(details.value[0])}
        min={0.2}
        step={0.1}
      />
      <Text>Dot number: {dotNb}</Text>
      <DorSlider
        width="150px"
        max={15}
        value={[dotNb]}
        onValueChange={(details) => setDotNb(details.value[0])}
        min={7}
      />
    </Flexbox>
  );
}
