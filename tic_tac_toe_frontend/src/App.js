import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App renders a complete Tic Tac Toe game:
 * - 3x3 grid of cells (role=grid) with aria-labels for accessibility
 * - Alternating turns between 'X' and 'O'
 * - Win and draw detection with status header
 * - Restart button to reset the game
 * - Cells are disabled after game over
 */
function App() {
  // Board is an array of 9 cells: 'X' | 'O' | null
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  // Compute winner and draw state
  const winner = useMemo(() => calculateWinner(board), [board]);
  const isDraw = useMemo(
    () => !winner && board.every((c) => c !== null),
    [winner, board]
  );

  // Update gameOver based on derived state
  React.useEffect(() => {
    if (winner || isDraw) {
      setGameOver(true);
    } else {
      setGameOver(false);
    }
  }, [winner, isDraw]);

  // PUBLIC_INTERFACE
  const handleCellClick = (index) => {
    /** Handles a user move by marking the cell if valid and toggling the player. */
    if (board[index] || gameOver) return;

    const nextBoard = board.slice();
    nextBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    /** Resets the board and state to start a fresh game. */
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
  };

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
    ? 'Draw!'
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="ttt-app">
      <header className="ttt-header">
        <h1 className="ttt-title" aria-label="Tic Tac Toe">
          Tic Tac Toe
        </h1>
        <p className="ttt-status" aria-live="polite">
          {statusText}
        </p>
      </header>

      <main className="ttt-main">
        <div
          className="ttt-board"
          role="grid"
          aria-label="Tic Tac Toe board"
          aria-readonly={gameOver ? 'true' : 'false'}
        >
          {board.map((value, idx) => (
            <button
              key={idx}
              className="ttt-cell"
              role="gridcell"
              aria-label={`Cell ${idx + 1}${value ? `, ${value}` : ''}`}
              aria-disabled={gameOver || !!value}
              onClick={() => handleCellClick(idx)}
              disabled={gameOver || !!value}
              data-cell-index={idx}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="ttt-controls">
          <button
            className="ttt-restart"
            onClick={handleRestart}
            aria-label="Restart game"
          >
            Restart
          </button>
        </div>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
export function calculateWinner(squares) {
  /**
   * Determines the winner for a given 3x3 board.
   * Returns 'X', 'O', or null if no winner.
   */
  const lines = [
    [0, 1, 2], // Rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonals
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
