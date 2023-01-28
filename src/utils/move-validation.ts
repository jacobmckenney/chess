import { isEqual } from "lodash";
import { Pawn, Bishop, Knight, Rook, Queen, King } from "../constants/board";
import type { Square, BoardState } from "../types/board";
import type { Selection } from "../types/board";

// TODO: Need BoardState
const isBlocked = (from: Square, to: Square, boardState: BoardState) => {
  const { board } = boardState;
  const [minCol, maxCol] = [Math.min(from.absCol, to.absCol), Math.max(from.absCol, to.absCol)];
  const [minRow, maxRow] = [Math.min(from.absRow, to.absRow), Math.max(from.absRow, to.absRow)];
  if (onRow(from, to)) {
    for (let i = minCol + 1; i < maxCol; i++) {
      if (board[minRow][i] !== null) return true;
    }
  } else if (onCol(from, to)) {
    for (let i = minRow + 1; i < maxRow; i++) {
      if (board[i][minCol] !== null) return true;
    }
  } else if (onDiagonal(from, to)) {

  }
  return false;
};

const getDiffs = (from: Square, to: Square) => {
  const diffX = Math.abs(from.absCol - to.absCol);
  const diffY = Math.abs(from.absRow - to.absRow);
  return { diffX, diffY };
}


const onRow = (from: Square, to: Square) => {
    const { diffY } = getDiffs(from, to);
    return diffY == 0;
}

const onCol = (from: Square, to: Square) => {
    const { diffX} = getDiffs(from, to);
    return diffX == 0;
}

const onCross = (from: Square, to: Square) => onRow(from, to) || onCol(from, to);

const onDiagonal = (from: Square, to: Square) => {
    const { diffX, diffY } = getDiffs(from, to);
  return diffX - diffY === 0;
};

// This will be a pretty complicated function, need to incorporate castling, en passant, knight moves, etc.
// probably should just calculate all possible squares and just execute containment conditional so that the
// logic of finding squares can be applied in the future to just the general experience - when a user
// selects a piece all valid squares for that piece are highlighted
export const isValidMove = (from: Selection, to: Square, boardState: BoardState) => {
  const { selectedPiece, square: fromSquare } = from;
  const { board } = boardState;
  const { type, color } = selectedPiece;
  if (isEqual(fromSquare, to) || (color === board[to.absRow][to.absCol]?.color)) {
    return false;
  }
  switch (type) {
    case Pawn:
      // TODO: incorporate en passant
      return to.absCol === from.square.absCol;
    case Bishop:
      return onDiagonal(fromSquare, to) && !isBlocked(fromSquare, to, boardState);
    case Knight:
      return true;
    case Rook:
        return (onCross(fromSquare, to)) && !isBlocked(fromSquare, to, boardState);
    case Queen:
        return (onDiagonal(fromSquare, to) || onCross(fromSquare, to)) && !isBlocked(fromSquare, to, boardState);
    case King:
        return true;
    default:
        return false;
  }
};