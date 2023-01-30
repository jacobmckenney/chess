import { useCycle } from "framer-motion";
import React, { useMemo, useState } from "react";
import useMeasure from "react-use-measure";
import PieceDisplay from "../components/features/board/Piece";
import Button from "../components/ui/Button";
import ProfileBadge from "../components/ui/ProfileBadge";
import { White, Black, INITIAL_BOARD } from "../constants/board";
import type { MoveInfo, Piece, UpdateBoardArgs } from "../types/board";
import type { BoardState, Color, Square } from "../types/board";
import { inverseColor } from "../utils/board";
import { reverse2d } from "../utils/misc";
import { isValidMove } from "../utils/move-validation";

interface Props {
  gameId: string;
  isWhite: boolean;
}

const colToFile = (col: number) => {
  return String.fromCharCode(col + 65);
};

const getPieceInfo = (
  rowIdx: number,
  colIdx: number,
  pov: Color,
  selected: Square | null
) => {
  const absRow = pov ? rowIdx : 7 - rowIdx;
  const absCol = pov ? colIdx : 7 - colIdx;
  const square = { absCol, absRow };
  const isSelected = selected?.absCol === absCol && selected?.absRow === absRow;
  const displayRank = pov ? 8 - rowIdx : rowIdx + 1;
  const displayFile = colToFile(pov ? colIdx : 7 - colIdx);
  return {
    square,
    isSelected,
    displayRank,
    displayFile,
  };
};

const updateBoard = ({
  piece,
  isSelected,
  to,
  boardState,
  selected,
  setSelected,
  setBoardState,
}: UpdateBoardArgs) => {
  const {
    board,
    turn,
    moves: { white, black },
  } = boardState;
  if (piece && turn === piece.color) {
    setSelected(isSelected ? null : to);
  }
  if (!selected) return;
  const { isValid, taken } = isValidMove(selected, to, boardState);
  if (!isValid) return;
  // Update board
  const { absRow: fromRow, absCol: fromCol } = selected;
  const { absRow: toRow, absCol: toCol } = to;
  const selectedPiece = board[selected.absRow][selected.absCol] as Piece;
  selectedPiece.numMoves++;
  const getNextMove = (
    arr: MoveInfo[],
    move: MoveInfo,
    turn: Color
  ): MoveInfo[] => {
    if (turn) {
      arr.push(move);
    }
    return arr;
  };
  const newMove = { piece: selectedPiece, from: selected, to };
  const [newWhite, newBlack] = [
    getNextMove(white, newMove, turn),
    getNextMove(black, newMove, inverseColor(turn)),
  ];
  setBoardState((prev) => {
    const { board } = prev;
    if (taken) {
      board[taken.absRow][taken.absCol] = null;
    }
    board[fromRow][fromCol] = null;
    board[toRow][toCol] = selectedPiece;
    // Log move
    return {
      ...prev,
      moves: {
        white: newWhite,
        black: newBlack,
        move: prev.moves.move + 1,
      },
      board,
      turn: prev.turn === White ? Black : White,
    };
  });
  setSelected(null);
};

const Board: React.FC<Props> = ({}) => {
  const [pov, cyclePov] = useCycle<Color>(White, Black);
  const [selected, setSelected] = useState<Square | null>(null);
  const [boardState, setBoardState] = useState<BoardState>({
    white: { name: "jake", elo: 2000 },
    black: { name: "spence", elo: 2500 },
    turn: White,
    moves: { white: [], black: [], move: 0 },
    board: INITIAL_BOARD,
  });
  const { white, black, board } = boardState;

  const [ref, { height, width }] = useMeasure();
  const boardLen = Math.min(height - height * 0.15, width - width * 0.15);
  const squareLen = boardLen / 8;
  const pieceSize = squareLen * 0.9;

  const user = pov ? white : black;
  const opponent = pov ? black : white;

  const getDisplayBoard = (board: (Piece | null)[][]) => {
    return pov ? board : reverse2d<Piece | null>(board);
  };
  const displayBoard = getDisplayBoard(board);

  return (
    <div
      ref={ref}
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"
    >
      <div>
        <ProfileBadge user={opponent} />
        <Button action={cyclePov}>Switch Pov</Button>
      </div>
      <div
        className="grid grid-cols-8 bg-black shadow-md shadow-black"
        style={{ width: boardLen, height: boardLen }}
      >
        {displayBoard.map((pieceRow, rowIdx) =>
          pieceRow.map((piece, colIdx) => {
            const { square, isSelected, displayRank, displayFile } =
              getPieceInfo(rowIdx, colIdx, pov, selected);
            return (
              <div
                onClick={() =>
                  updateBoard({
                    piece,
                    isSelected,
                    to: square,
                    boardState,
                    selected,
                    setSelected,
                    setBoardState,
                  })
                }
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
                  <PieceDisplay size={pieceSize} piece={piece} />
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
