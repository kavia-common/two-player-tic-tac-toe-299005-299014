import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Tic Tac Toe App', () => {
  test('renders title and status', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /tic tac toe/i })).toBeInTheDocument();
    expect(screen.getByText(/Next player: X/i)).toBeInTheDocument();
    // Board with 9 cells
    expect(screen.getAllByRole('gridcell')).toHaveLength(9);
  });

  test('allows a move and updates status', () => {
    render(<App />);
    const cells = screen.getAllByRole('gridcell');
    fireEvent.click(cells[0]); // X
    expect(cells[0]).toHaveTextContent('X');
    expect(screen.getByText(/Next player: O/i)).toBeInTheDocument();
  });

  test('detects a winning scenario', () => {
    render(<App />);
    const cells = screen.getAllByRole('gridcell');

    // X will win on the top row: 0,1,2
    fireEvent.click(cells[0]); // X
    fireEvent.click(cells[3]); // O
    fireEvent.click(cells[1]); // X
    fireEvent.click(cells[4]); // O
    fireEvent.click(cells[2]); // X wins

    expect(screen.getByText(/Winner: X/i)).toBeInTheDocument();

    // After game over, further moves should be disabled
    expect(cells[5]).toBeDisabled();
  });

  test('detects a draw scenario', () => {
    render(<App />);
    const cells = screen.getAllByRole('gridcell');

    // Fill the board with no winner
    // X O X
    // X X O
    // O X O
    fireEvent.click(cells[0]); // X
    fireEvent.click(cells[1]); // O
    fireEvent.click(cells[2]); // X
    fireEvent.click(cells[4]); // O
    fireEvent.click(cells[3]); // X
    fireEvent.click(cells[5]); // O
    fireEvent.click(cells[7]); // X
    fireEvent.click(cells[6]); // O
    fireEvent.click(cells[8]); // X

    expect(screen.getByText(/Draw!/i)).toBeInTheDocument();
  });
});
