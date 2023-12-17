import { useState, useEffect } from "react";
import SquareProps from "../interfaces/SquareProps";

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button onClick={onSquareClick} className="square">
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  useEffect(() => {
    if (!xIsNext) {
      // AI's turn
      const nextSquares = squares.slice();
      const aiMove = getAIMove(nextSquares);
      nextSquares[aiMove] = "O";
      setSquares(nextSquares);
      setXIsNext(true);
    }
  }, [xIsNext, squares]);

  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[i] = "X";

    setSquares(nextSquares);
    setXIsNext(false);

    const winner = calculateWinner(nextSquares);
    if (winner || !nextSquares.includes("")) {
    }
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.includes("")) {
    status = "Next player: " + (xIsNext ? "X" : "O");
  } else {
    status = "It's a draw!";
  }

  return (
    <>
      <div className="backdrop__container">
        <div className="status">{status}</div>
        <div className="board-row">
          <Square
            onSquareClick={() => handleClick(0)}
            value={squares[0]}
            index={0}
          />
          <Square
            onSquareClick={() => handleClick(1)}
            value={squares[1]}
            index={1}
          />
          <Square
            onSquareClick={() => handleClick(2)}
            value={squares[2]}
            index={2}
          />
        </div>
        <div className="board-row">
          <Square
            onSquareClick={() => handleClick(3)}
            value={squares[3]}
            index={3}
          />
          <Square
            onSquareClick={() => handleClick(4)}
            value={squares[4]}
            index={4}
          />
          <Square
            onSquareClick={() => handleClick(5)}
            value={squares[5]}
            index={5}
          />
        </div>
        <div className="board-row">
          <Square
            onSquareClick={() => handleClick(6)}
            value={squares[6]}
            index={6}
          />
          <Square
            onSquareClick={() => handleClick(7)}
            value={squares[7]}
            index={7}
          />
          <Square
            onSquareClick={() => handleClick(8)}
            value={squares[8]}
            index={8}
          />
        </div>

        <button onClick={resetGame} className="refresh-button">
          Refresh
        </button>
      </div>
    </>
  );
}
function calculateWinner(squares: string[]) {
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
function getAIMove(squares: string[]) {
  const aiPlayer = "O";
  const humanPlayer = "X";

  function minimax(
    newBoard: string[],
    player: string
  ): { score: number; index: number } {
    const availableMoves = getAvailableMoves(newBoard);

    if (checkWin(newBoard, humanPlayer)) {
      return { score: -1, index: -1 };
    } else if (checkWin(newBoard, aiPlayer)) {
      return { score: 1, index: -1 };
    } else if (availableMoves.length === 0) {
      return { score: 0, index: -1 };
    }

    const moves: { score: number; index: number }[] = [];

    for (let i = 0; i < availableMoves.length; i++) {
      const move = { index: availableMoves[i], score: 0 };
      newBoard[availableMoves[i]] = player;

      if (player === aiPlayer) {
        const result = minimax(newBoard, humanPlayer);
        move.score = result.score;
      } else {
        const result = minimax(newBoard, aiPlayer);
        move.score = result.score;
      }

      newBoard[availableMoves[i]] = "";
      moves.push(move);
    }

    let bestMove = 0;
    if (player === aiPlayer) {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  return minimax(squares, aiPlayer).index;
}

function getAvailableMoves(squares: string[]) {
  const moves: number[] = [];
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      moves.push(i);
    }
  }
  return moves;
}
function checkWin(squares: string[], player: string) {
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
    if (
      squares[a] === player &&
      squares[b] === player &&
      squares[c] === player
    ) {
      return true;
    }
  }

  return false;
}
