import React, { useState } from "react";
import useMeasure from "react-use-measure";
import Piece from "../components/features/board/Piece";
import ProfileBadge from "../components/ui/ProfileBadge";
import { INITIAL_BOARD, White, Black } from "../constants/board";
import type { BoardState, Selection, Square } from "../types/board";

interface Props {
  gameId: string;
  isWhite: boolean;
}

const colToFile = (col: number) => {
  return String.fromCharCode(col + 65);
};

const isValidMove = (from: Selection, to: Square) => {
  return true;
};

const Board: React.FC<Props> = ({ gameId, isWhite = true }) => {
  const [boardState, setBoardState] = useState<BoardState>({
    white: { name: "jake", elo: 2000 },
    black: { name: "spence", elo: 2500 },
    turn: White,
    moves: [],
    board: INITIAL_BOARD,
  });
  const { white, black, turn, moves, board } = boardState;

  const [ref, { height, width }] = useMeasure();
  const boardLen = Math.min(height - height * 0.15, width - width * 0.15);
  const squareLen = boardLen / 8;
  const pieceSize = squareLen * 0.9;

  const user = isWhite ? white : black;
  const opponent = isWhite ? black : white;

  const [selected, setSelected] = useState<Selection | null>(null);
  return (
    <div
      ref={ref}
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"
    >
      <ProfileBadge user={opponent} />
      <div
        className="grid grid-cols-8 bg-black shadow-md shadow-black"
        style={{ width: boardLen, height: boardLen }}
      >
        {INITIAL_BOARD.map((piece, idx) => {
          const blackRow = Math.floor(idx / 8);
          const row = isWhite ? 7 - blackRow : blackRow;
          const rank = row + 1;

          const whiteFile = idx % 8;
          const col = isWhite ? whiteFile : 7 - whiteFile;

          const file = colToFile(col);
          const isSelected =
            selected?.square?.col === whiteFile &&
            selected?.square?.row === blackRow;

          const square = { col: whiteFile, row: blackRow };

          return (
            <div
              onClick={() => {
                // TODO: extract to separate function
                // TODO: log move in board state
                if (!selected) return;
                if (isValidMove(selected, square)) {
                  setSelected(null);
                  // Update board
                  setBoardState((prev) => {
                    const { board } = prev;
                    board[selected.square.row * 8 + selected.square.col] = null;
                    board[square.row * 8 + square.col] = selected.selectedPiece;
                    return {
                      ...prev,
                      board,
                      turn: prev.turn === White ? Black : White,
                    };
                  });
                }
              }}
              className={`relative flex items-center justify-center text-black ${
                isSelected
                  ? "bg-red-600"
                  : (idx % 2 === row % 2) == isWhite
                  ? "bg-gray-400"
                  : "bg-white"
              }`}
              key={idx}
            >
              <div className="absolute top-0 left-0 text-sm">{`${file}${rank}`}</div>
              {piece ? (
                <Piece
                  onClick={() => {
                    if (turn === piece.color) {
                      setSelected(
                        isSelected
                          ? null
                          : {
                              selectedPiece: piece,
                              square,
                            }
                      );
                    }
                  }}
                  size={pieceSize}
                  piece={piece}
                />
              ) : (
                <div style={{ width: pieceSize, height: pieceSize }} />
              )}
            </div>
          );
        })}
      </div>
      <ProfileBadge user={user} />
    </div>
  );
};

export default Board;
