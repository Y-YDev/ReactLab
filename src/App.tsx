import { Tabs } from "@chakra-ui/react";
import OptimisticUpdates from "./optimistic-updates/OptimisticUpdates";
import Sudoku from "./sudoku/Sudoku";
import AnimationsPage from "./animation-css/AnimationsPage";

function App() {
  return (
    <Tabs.Root defaultValue="optimistic-updates">
      <Tabs.List>
        <Tabs.Trigger value="optimistic-updates">
          Optimistic Updates
        </Tabs.Trigger>
        <Tabs.Trigger value="sudoku">Sudoku</Tabs.Trigger>
        <Tabs.Trigger value="animations">Animations</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="optimistic-updates">
        <OptimisticUpdates />
      </Tabs.Content>
      <Tabs.Content value="sudoku">
        <Sudoku />
      </Tabs.Content>
      <Tabs.Content value="animations">
        <AnimationsPage />
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default App;
