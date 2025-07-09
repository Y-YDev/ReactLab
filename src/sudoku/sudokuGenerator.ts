import { getRandomInt } from "@/utils";
import _ from "lodash";

export type ISudokuGrid = number[][];
export type ESudokuDifficulty = "easy" | "medium" | "hard";

function isValid(
  grid: ISudokuGrid,
  row: number,
  col: number,
  numToTest: number
): boolean {
  // Check line and column
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === numToTest) return false;
    if (grid[i][col] === numToTest) return false;
  }

  // Check 3x3 subgrid
  const rowSubGrid = Math.floor(row / 3) * 3;
  const colSubGrid = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[rowSubGrid + i][colSubGrid + j] === numToTest) return false;
    }
  }
  return true;
}

export function solveSudoku(grid: ISudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let numToTest = 1; numToTest <= 9; numToTest++) {
          if (isValid(grid, row, col, numToTest)) {
            grid[row][col] = numToTest;
            if (solveSudoku(grid)) {
              return true;
            }
            grid[row][col] = 0; // Backtrack
          }
        }
        return false; // No valid number found
      }
    }
  }
  return true; // Solved
}

export function countSudokuSolutions(grid: ISudokuGrid, limit = 2): number {
  let count = 0;

  function subSolve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (subSolve()) {
                // We copy in the method that dig hole, so no need in fact, but we keep backtracking for external calls
                grid[row][col] = 0;
                // If we reach the limit, return true to stop further searching in other recursions
                return true;
              }
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    count++;
    return count >= limit;
  }

  subSolve();
  return count;
}

export function generateFullSudoku(): ISudokuGrid {
  const grid: ISudokuGrid = Array.from({ length: 9 }, () => Array(9).fill(0));

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== 0) continue;

      const numToPut = Math.floor(Math.random() * 9) + 1; // Random number between 1 and 9

      if (isValid(grid, row, col, numToPut)) {
        grid[row][col] = numToPut;
        if (solveSudoku(grid)) {
          return grid; // Return the grid if solved
        }
        grid[row][col] = 0; // Backtrack if not solved
      }
    }
  }
  return grid;
}

export function cloneSudokuGrid(grid: ISudokuGrid): ISudokuGrid {
  return _.cloneDeep(grid);
}

function digHoleInFullSudoku(
  grid: ISudokuGrid,
  holesToDig: number
): ISudokuGrid {
  const gridWithHoles = cloneSudokuGrid(grid);
  let holesDone = 0;
  let maxAttempts = 1000;

  while (holesDone < holesToDig && maxAttempts > 0) {
    maxAttempts--;
    let row = getRandomInt(1, 9) - 1;
    let col = getRandomInt(1, 9) - 1;

    let previousValue = gridWithHoles[row][col];
    while (previousValue === 0) {
      // Ensure we don't dig a hole in an already empty cell
      row = getRandomInt(1, 9) - 1;
      col = getRandomInt(1, 9) - 1;
      previousValue = gridWithHoles[row][col];
    }
    gridWithHoles[row][col] = 0; // Dig a hole

    const gridToTest = cloneSudokuGrid(gridWithHoles);
    if (countSudokuSolutions(gridToTest) > 1) {
      gridWithHoles[row][col] = previousValue; // Restore the value if it leads to multiple solutions
    } else {
      holesDone++; // Only count the hole if it doesn't lead to multiple solutions
    }
  }
  return gridWithHoles;
}

function getHolesByDifficulty(difficulty: ESudokuDifficulty): number {
  switch (difficulty) {
    case "easy":
      return 40;
    case "medium":
      return 49;
    case "hard":
      return 57;
  }
}

export function generateSudoku(difficulty: ESudokuDifficulty): {
  solution: ISudokuGrid;
  grid: ISudokuGrid;
} {
  const holesToDig = getHolesByDifficulty(difficulty);

  const solution = generateFullSudoku();
  const sudokuWithHoles = digHoleInFullSudoku(solution, holesToDig);

  return { solution, grid: sudokuWithHoles };
}
