import { Tabs } from "@chakra-ui/react";
import OptimisticUpdates from "./optimistic-updates/OptimisticUpdates";

function App() {
  return (
    <Tabs.Root defaultValue="optimistic-updates">
      <Tabs.List>
        <Tabs.Trigger value="optimistic-updates">
          Optimistic Updates
        </Tabs.Trigger>
        <Tabs.Trigger value="tbd">TBD</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="optimistic-updates">
        <OptimisticUpdates />
      </Tabs.Content>
      <Tabs.Content value="tbd">TBD</Tabs.Content>
    </Tabs.Root>
  );
}

export default App;
