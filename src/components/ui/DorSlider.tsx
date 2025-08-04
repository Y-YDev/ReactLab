import { Slider } from "@chakra-ui/react";

export default function DorSlider(props: Slider.RootProps) {
  return (
    <Slider.Root {...props}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
  );
}
