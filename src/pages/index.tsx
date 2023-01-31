import { useCycle } from "framer-motion";
import React, { useState } from "react";
import useMeasure from "react-use-measure";
import PieceDisplay from "../components/features/board/Piece";
import { White, Black, INITIAL_BOARD, King } from "../constants/board";
import type {
  InitialBoardState,
  MoveInfo,
  Piece,
  PotentialMove,
  Selection,
  UpdateBoardArgs,
} from "../types/board";
import type { BoardState, Color, Square } from "../types/board";
import { inverseColor } from "../utils/board";
import { findPiece, reverse2d } from "../utils/misc";
import { checkOrMate, squaresUnderAttackBy } from "../utils/move-validation";
import some from "lodash/some";
import find from "lodash/find";

interface Props {
  gameId: string;
  isWhite: boolean;
}

const colToFile = (col: number) => {
  return String.fromCharCode(col + 65);
};

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

const getBoardStateFromInitial = (initial: InitialBoardState) => {
  const temp: BoardState = {
    ...initial,
    validity: { validMoves: [], check: false, checkMate: false },
  };
  temp.validity = checkOrMate(temp, inverseColor(temp.turn));
  return temp;
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

const getMutators = (
  { absRow: fromRow, absCol: fromCol }: Square,
  { absRow: toRow, absCol: toCol }: Square,
  boardState: BoardState,
  selectedPiece: Piece,
  potentialMove: PotentialMove
) => {
  const { board } = boardState;
  const fromPiece = board[fromRow][fromCol];
  const toPiece = board[toRow][toCol];
  const { taken, additional } = potentialMove;
  let takenPiece: Piece | null;
  let additionalPiece: Piece | null;
  const mutate = () => {
    // Mutate board
    board[fromRow][fromCol] = null;
    board[toRow][toCol] = selectedPiece;
    if (taken) {
      // Used for en passant where piece is taken that isn't where moved piece lands
      const { absRow: takenRow, absCol: takenCol } = taken;
      takenPiece = board[takenRow][takenCol];
      board[takenRow][takenCol] = null;
    }
    if (additional) {
      // Used for castling where the rook moves without being touched
      const {
        to: { absRow: aToRow, absCol: aToCol },
        from: { absRow: aFromRow, absCol: aFromCol },
        piece,
      } = additional;
      additionalPiece = board[aFromRow][aFromCol];
      board[aFromRow][aFromCol] = null;
      board[aToRow][aToCol] = piece;
    }
  };

  const revert = () => {
    // revert mutation because we don't deep copy the board for efficiency's sake
    if (taken) {
      const { absRow: takenRow, absCol: takenCol } = taken;
      board[takenRow][takenCol] = takenPiece;
    }
    if (additional) {
      const {
        to: { absRow: aToRow, absCol: aToCol },
        from: { absRow: aFromRow, absCol: aFromCol },
      } = additional;
      board[aToRow][aToCol] = null;
      board[aFromRow][aFromCol] = additionalPiece;
    }
    board[fromRow][fromCol] = fromPiece;
    board[toRow][toCol] = toPiece;
  };
  return { mutate, revert };
};

const updateBoard = ({
  piece,
  isSelected,
  to,
  boardState,
  selection,
  setSelection,
  setBoardState,
  cyclePov,
}: UpdateBoardArgs) => {
  const {
    board,
    turn,
    moves: { white, black },
  } = boardState;
  // Select the clicked piece or revert if it's already selected
  if (piece && turn === piece.color) {
    setSelection(
      isSelected
        ? null
        : {
            square: to,
            validMoves:
              boardState.validity.validMoves[to.absRow][to.absCol] ?? [],
          }
    );
  }
  if (!selection) return;
  // Check to see if the desired square is within the valid moves for given piece
  const potentialMove = find(selection.validMoves, to as PotentialMove);
  if (!potentialMove) return;
  const selected = selection.square;
  const selectedPiece = board[selected.absRow][selected.absCol] as Piece;
  // Update board
  const { mutate, revert } = getMutators(
    selected,
    to,
    boardState,
    selectedPiece,
    potentialMove
  );
  mutate();
  // 169 - 178 is a safeguard while I'm getting the validation logic perfect, will be removed later
  if (
    squaresUnderAttackBy(
      boardState,
      [findPiece(board, King, turn)],
      inverseColor(turn)
    )
  ) {
    revert();
    return;
  }
  // commit state change
  selectedPiece.numMoves++;
  const newMove = { piece: selectedPiece, from: selected, to };
  const [newWhite, newBlack] = [
    getNextMove(white, newMove, turn),
    getNextMove(black, newMove, inverseColor(turn)),
  ];
  setBoardState((prev) =>
    getBoardStateFromInitial({
      ...prev,
      moves: {
        white: newWhite,
        black: newBlack,
        move: prev.moves.move + 1,
      },
      board,
      turn: prev.turn === White ? Black : White,
    })
  );
  setSelection(null);
  cyclePov();
};

const Board: React.FC<Props> = ({}) => {
  const [pov, cyclePov] = useCycle<Color>(White, Black);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [boardState, setBoardState] = useState<BoardState>(() =>
    getBoardStateFromInitial({
      white: { name: "jake", elo: 2000 },
      black: { name: "spence", elo: 2500 },
      turn: White,
      moves: { white: [], black: [], move: 0 },
      board: INITIAL_BOARD,
    })
  );
  const { board, turn } = boardState;

  const [ref, { height, width }] = useMeasure();
  const boardLen = Math.min(height - height * 0.15, width - width * 0.15);
  const squareLen = boardLen / 8;
  const pieceSize = squareLen * 0.9;

  const getDisplayBoard = (board: (Piece | null)[][]) => {
    return pov ? board : reverse2d<Piece | null>(board);
  };
  const displayBoard = getDisplayBoard(board);

  return (
    <div
      ref={ref}
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"
    >
      <div
        className="grid grid-cols-8 bg-black shadow-md shadow-black"
        style={{ width: boardLen, height: boardLen }}
      >
        {displayBoard.map((pieceRow, rowIdx) =>
          pieceRow.map((piece, colIdx) => {
            const { square, isSelected, displayRank, displayFile } =
              getPieceInfo(rowIdx, colIdx, pov, selection?.square ?? null);
            return (
              <div
                onClick={() =>
                  updateBoard({
                    piece,
                    isSelected,
                    to: square,
                    boardState,
                    selection: selection,
                    setSelection,
                    setBoardState,
                    cyclePov,
                  })
                }
                key={`${rowIdx}${colIdx}`}
                className={`relative flex items-center justify-center text-black ${
                  isSelected
                    ? "bg-red-500"
                    : some(selection?.validMoves, square)
                    ? "bg-green-400"
                    : colIdx % 2 == rowIdx % 2
                    ? "bg-gray-400"
                    : "bg-white"
                }
                ${piece?.color === turn ? "cursor-pointer" : "cursor-default"}`}
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
      <button onClick={() => checkOrMate(boardState, White)}>
        checkormate
      </button>
    </div>
  );
};

export default Board;
