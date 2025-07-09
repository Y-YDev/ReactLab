import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type ESudokuDifficulty,
  type ISudokuGrid,
  cloneSudokuGrid,
  generateSudoku,
} from "./sudokuGenerator";

const boxStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  textAlign: "center",
  alignItems: "center",
  justifyContent: "center",
};

function SudokuGrid(props: {
  sudoku: ISudokuGrid;
  onCellClick?: (row: number, col: number) => void;
  baseSoduku?: ISudokuGrid;
}) {
  return (
    <Grid templateRows="repeat(9, 1fr)" backgroundColor={"white"}>
      {props.sudoku.map((row, rowIndex) => (
        <Grid templateColumns="repeat(9, 1fr)" key={rowIndex}>
          {row.map((cell, colIndex) => {
            const existingInBase = props.baseSoduku
              ? props.baseSoduku[rowIndex][colIndex] !== 0
              : false;

            return (
              <Flex
                style={boxStyle}
                key={colIndex}
                borderRight={
                  colIndex % 3 === 2 ? "3px solid black" : "1px solid black"
                }
                borderBottom={
                  rowIndex % 3 === 2 ? "3px solid black" : "1px solid black"
                }
                backgroundColor={existingInBase ? "#e8e6e5" : "white"}
                onClick={() => props.onCellClick?.(rowIndex, colIndex)}
                _hover={{
                  backgroundColor: existingInBase ? "#d4d2d0" : "lightblue",
                  cursor: "pointer",
                }}
              >
                <Text
                  color={existingInBase ? "black" : "blue.600"}
                  fontSize={20}
                >
                  {cell !== 0 ? cell : ""}
                </Text>
              </Flex>
            );
          })}
        </Grid>
      ))}
    </Grid>
  );
}

export default function Sudoku() {
  const [difficulty, setDifficulty] = useState<ESudokuDifficulty>("easy");

  const { solution, grid } = useMemo(() => {
    return generateSudoku(difficulty);
  }, [difficulty]);

  const [currentGrid, setCurrentGrid] = useState<ISudokuGrid>(
    cloneSudokuGrid(grid)
  );

  useEffect(() => {
    setCurrentGrid(cloneSudokuGrid(grid));
  }, [grid]);

  const [hideSolution, setHideSolution] = useState(true);
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [win, setWin] = useState(false);

  const onSelectNumber = useCallback(
    (selectNb: number) => {
      if (selectNb === selectedNumber) {
        setSelectedNumber(0); // Deselect if already selected
      } else {
        setSelectedNumber(selectNb);
      }
    },
    [selectedNumber]
  );

  const checkWin = useCallback(() => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentGrid[row][col] === 0) return false;
        if (currentGrid[row][col] !== solution[row][col]) return false;
      }
    }
    return true;
  }, [currentGrid, solution]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      // Do nothing if no number is selected
      if (selectedNumber === 0) return;

      // Assert that the cell is empty
      if (grid[row][col] !== 0) return;

      const newGrid = cloneSudokuGrid(currentGrid);
      newGrid[row][col] = selectedNumber === 10 ? 0 : selectedNumber;

      setCurrentGrid(newGrid);
    },
    [selectedNumber, grid, currentGrid]
  );

  useEffect(() => {
    if (checkWin()) {
      setWin(true);
    } else {
      setWin(false);
    }
  }, [currentGrid, checkWin]);

  return (
    <Flex gap={5} flexDirection={"column"} padding={5}>
      <Flex gap={2}>
        <Button
          onClick={() => setHideSolution(!hideSolution)}
          width={"fit-content"}
        >
          Show/Hide Solution
        </Button>
        {["easy", "medium", "hard"].map((level) => (
          <Button
            key={level}
            onClick={() => {
              setDifficulty(level as ESudokuDifficulty);
              setWin(false);
            }}
            backgroundColor={difficulty === level ? "#4dd0e1" : "white"}
          >
            {level}
          </Button>
        ))}
      </Flex>
      {win && (
        <Text fontSize={24} color="green">
          🎉 You win! Congratulations 🎉
        </Text>
      )}
      <Flex gap={5}>
        <SudokuGrid
          sudoku={currentGrid}
          baseSoduku={grid}
          onCellClick={handleCellClick}
        />
        {!hideSolution && <SudokuGrid sudoku={solution} />}
      </Flex>
      <Flex gap={5}>
        {Array.from({ length: 9 }, (_, i) => (
          <Flex style={boxStyle} key={i}>
            <Button
              backgroundColor={selectedNumber === i + 1 ? "#4dd0e1" : "white"}
              fontSize={20}
              color={"black"}
              onClick={() => onSelectNumber(i + 1)}
            >
              {i + 1}
            </Button>
          </Flex>
        ))}
        <Button
          color={"black"}
          onClick={() => onSelectNumber(10)}
          backgroundColor={selectedNumber === 10 ? "#4dd0e1" : "white"}
        >
          Erase
        </Button>
      </Flex>
    </Flex>
  );
}
