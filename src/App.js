import { useState } from "react";

function Square(props) {
  return (
    <button className="square" onClick={props.onSquareClick}>
      {props.value}
    </button>
  );
}

function BoardRow({ row, squares, onSquareClick }) {
  const cells = [];
  for (let i = 0; i < 3; i++) {
    cells.push(
      <Square
        value={squares[row * 3 + i]}
        onSquareClick={() => onSquareClick(row * 3 + i)}
      />
    );
  }

  return <div className="board-row">{cells}</div>;
}

function Board({ xIsNext, squares, onPlay }) {
  function handleSquareClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const rows = [];
  for (let i = 0; i < 3; i++) {
    rows.push(
      <BoardRow row={i} squares={squares} onSquareClick={handleSquareClick} />
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory, nextSquares);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      if (move === currentMove) {
        description = `You are at move #${move} (current)`;
      } else {
        description = `Go to move #${move}`;
      }
    } else {
      description = `Go to game start`;
    }
    return (
      <li key={move}>
        {move !== currentMove ? (
          <button onClick={() => jumpTo(move)}>{description}</button>
        ) : (
          description
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={currentMove % 2 === 0}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
