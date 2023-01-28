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

const getRowAndFile = (boardIdx: number, pov: Color) => {
  const absRow = Math.floor(boardIdx / 8); // Absolute row in board array
  const row = pov ? 7 - absRow : absRow; // Row according to pov
  const rank = row + 1; // Display rank

  const absCol = boardIdx % 8; // absolute col in board array
  const col = pov ? absCol : 7 - absCol; // Col according to pov
  const file = colToFile(col); // Display file

  return { rank, file, absCol, absRow, col, row };
};

// TODOOOOOOOOO: convert all moves to a universal notation such that they can be acted upon
// whether you are viewing the game for black's pov or white's pov

const Board: React.FC<Props> = ({ gameId, isWhite }) => {
  const [pov, cyclePov] = useCycle<Color>(White, Black);
  const [boardState, setBoardState] = useState<BoardState>({
    white: { name: "jake", elo: 2000 },
    black: { name: "spence", elo: 2500 },
    turn: White,
    moves: [],
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
        {board.map(
          (pieceRow, rowIdx) =>
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
                    if (!selected) return;
                    if (isValidMove(selected, square)) {
                      setSelected(null);
                      // Update board
                      setBoardState((prev) => {
                        const { board } = prev;
                        // TODO: make helpers to map between absolute and relative vals
                        const relRow = pov
                          ? selected.square.absRow
                          : 7 - selected.square.absRow;
                        const relCol = pov
                          ? selected.square.absCol
                          : 7 - selected.square.absCol;
                        board[relRow][relCol] = null;
                        board[rowIdx][colIdx] = selected.selectedPiece;
                        return {
                          ...prev,
                          board,
                          turn: prev.turn === White ? Black : White,
                        };
                      });
                    }
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
          // const { rank, file, absCol, absRow, row } = getRowAndFile(idx, pov);
          // const isSelected =
          //   selected?.square?.col === absCol &&
          //   selected?.square?.row === absRow;

          // const square = { col: absCol, row: absRow };

          // <div
          //   onClick={() => {
          //     // TODO: extract to separate function
          //     // TODO: log move in board state
          //     if (!selected) return;
          //     if (isValidMove(selected, square)) {
          //       setSelected(null);
          //       // Update board
          //       setBoardState((prev) => {
          //         const { board } = prev;
          //         board[selected.square.row * 8 + selected.square.col] = null;
          //         board[square.row * 8 + square.col] = selected.selectedPiece;
          //         return {
          //           ...prev,
          //           board,
          //           turn: prev.turn === White ? Black : White,
          //         };
          //       });
          //     }
          //   }}
          //   className={`relative flex items-center justify-center text-black ${
          //     isSelected
          //       ? "bg-red-600"
          //       : (idx % 2 === row % 2) === !!pov
          //       ? "bg-gray-400"
          //       : "bg-white"
          //   }`}
          //   key={idx}
          // >
          //   <div className="absolute top-0 left-0 text-sm">{`${file}${rank}`}</div>
          //   {piece ? (
          //     <Piece
          //       onClick={() => {
          //         if (turn === piece.color) {
          //           setSelected(
          //             isSelected
          //               ? null
          //               : {
          //                   selectedPiece: piece,
          //                   square,
          //                 }
          //           );
          //         }
          //       }}
          //       size={pieceSize}
          //       piece={piece}
          //     />
          //   ) : (
          //     <div style={{ width: pieceSize, height: pieceSize }} />
          //   )}
          // </div>
        )}
      </div>
      <ProfileBadge user={user} />
    </div>
  );
};

export default Board;
