import { useCycle } from "framer-motion";
import React, { useState } from "react";
import useMeasure from "react-use-measure";
import Piece from "../components/features/board/Piece";
import Button from "../components/ui/Button";
import ProfileBadge from "../components/ui/ProfileBadge";
import {
  INITIAL_BOARD_BLACK,
  INITIAL_BOARD_WHITE,
  White,
  Black,
} from "../constants/board";
import type { BoardState, Color, Selection, Square } from "../types/board";

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

// TODOOOOOOOOO: convert all moves to a universal notation such that they can be acted upon
// whether you are viewing the game for black's pov or white's pov

// The board in boardState is the state of the UI, NOT the absolute board view (white's perspective)
const Board: React.FC<Props> = ({ gameId, isWhite }) => {
  const [pov, cyclePov] = useCycle<Color>(White, Black);
  const [boardState, setBoardState] = useState<BoardState>({
    white: { name: "jake", elo: 2000 },
    black: { name: "spence", elo: 2500 },
    turn: White,
    moves: { white: [], black: [], move: 0 },
    board: pov ? INITIAL_BOARD_WHITE : INITIAL_BOARD_BLACK,
  });
  const { white, black, turn, moves, board } = boardState;

  const [ref, { height, width }] = useMeasure();
  const boardLen = Math.min(height - height * 0.15, width - width * 0.15);
  const squareLen = boardLen / 8;
  const pieceSize = squareLen * 0.9;

  const user = pov ? white : black;
  const opponent = pov ? black : white;

  const [selected, setSelected] = useState<Selection | null>(null);
  return (
    <div
      ref={ref}
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"
    >
      <div>
        <ProfileBadge user={opponent} />
        <Button
          action={() => {
            setBoardState((prev) => {
              const { board } = prev;
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              const reverse = (arr: any[]) => arr.slice(0).reverse();
              return {
                ...prev,
                board: reverse(board).map(reverse) as (Piece | null)[][],
              };
            });
            cyclePov();
          }}
        >
          Switch Pov
        </Button>
      </div>
      <div
        className="grid grid-cols-8 bg-black shadow-md shadow-black"
        style={{ width: boardLen, height: boardLen }}
      >
        {board.map((pieceRow, rowIdx) =>
          pieceRow.map((piece, colIdx) => {
            // Mappings to a board from white's perspective
            const absRow = pov ? rowIdx : 7 - rowIdx;
            const absCol = pov ? colIdx : 7 - colIdx;
            const square = { absCol, absRow };
            const isSelected =
              selected?.square?.absCol === absCol &&
              selected?.square?.absRow === absRow;

            const displayRank = pov ? 8 - rowIdx : rowIdx + 1;
            const displayFile = colToFile(pov ? colIdx : 7 - colIdx);
            return (
              <div
                onClick={() => {
                  // TODO: extract to separate function
                  // TODO: log move in board state
                  if (!selected || !isValidMove(selected, square)) return;
                  setSelected(null);
                  // Update board
                  setBoardState((prev) => {
                    console.log("once");
                    const {
                      board,
                      moves: { move, white, black },
                    } = prev;
                    // TODO: make helpers to map between absolute and relative vals
                    // TODO: figure out why onClick is firing twice so that we can remove the move value on boardStae
                    // Update board pieces
                    const relRow = pov
                      ? selected.square.absRow
                      : 7 - selected.square.absRow;
                    const relCol = pov
                      ? selected.square.absCol
                      : 7 - selected.square.absCol;
                    board[relRow][relCol] = null;
                    board[rowIdx][colIdx] = selected.selectedPiece;
                    // Log move
                    (turn ? white : black)[move] = {
                      piece: selected.selectedPiece,
                      from: selected.square,
                      to: square,
                    };
                    return {
                      ...prev,
                      moves: {
                        white,
                        black,
                        move: prev.turn === White ? move : move + 1,
                      },
                      board,
                      turn: prev.turn === White ? Black : White,
                    };
                  });
                }}
                key={`${rowIdx}${colIdx}`}
                className={`relative flex items-center justify-center text-black ${
                  isSelected
                    ? "bg-red-500"
                    : colIdx % 2 == rowIdx % 2
                    ? "bg-gray-400"
                    : "bg-white"
                }`}
              >
                <div className="absolute top-0 left-0 text-sm">{`${displayFile}${displayRank}`}</div>
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
          })
        )}
      </div>
      <ProfileBadge user={user} />
    </div>
  );
};

export default Board;
