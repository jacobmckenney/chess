import { isEqual } from "lodash";
import { Pawn, Bishop, Knight, Rook, Queen, King, Black, White } from "../constants/board";
import type { Square, BoardState, Piece } from "../types/board";

type Diffs = {
  diffX: number,
  diffY: number,
}

const isBlocked = (from: Square, to: Square, boardState: BoardState, diffs: Diffs) => {
  const { board } = boardState;
  const [{ absCol: fromCol, absRow: fromRow}, {absCol: toCol, absRow: toRow}] = [from, to];
  const [minCol, maxCol] = [Math.min(fromCol, toCol), Math.max(fromCol, toCol)];
  const [minRow, maxRow] = [Math.min(fromRow, toRow), Math.max(fromRow, toRow)];
  const smallerSquare = fromRow < toRow ? from : to;
  if (onRow(diffs)) {
    for (let i = minCol + 1; i < maxCol; i++) {
      if (board[minRow][i] !== null) return true;
    }
  } else if (onCol(diffs)) {
    for (let i = minRow + 1; i < maxRow; i++) {
      if (board[i][minCol] !== null) return true;
    }
  } else if (onDiagonal(diffs)) {
    // Slope considered from "black's perspective" because the 0-index is the top of the absolute board
    const isPositiveSlope = (fromRow - toRow) / (fromCol - toCol) < 0;
    for (let i = 1; i < maxRow - minRow; i++) {
      const { absRow: smallRow, absCol: smallCol } = smallerSquare;
      const rowKey = smallRow + i;
      const colKey = isPositiveSlope ? smallCol - i  : smallCol + i;
      if (board[rowKey][colKey] !== null) return true;
    }
  }
  return false;
};

const getDiffs = (from: Square, to: Square) => {
  const diffX = Math.abs(from.absCol - to.absCol);
  const diffY = Math.abs(from.absRow - to.absRow);
  return { diffX, diffY };
}


const onRow = ({ diffY }: Diffs) => {
    return diffY == 0;
}

const onCol = ({ diffX }: Diffs) => {
    return diffX == 0;
}

const onCross = (diffs: Diffs) => onRow(diffs) || onCol(diffs);

const onDiagonal = ({ diffX, diffY }: Diffs) => {
  return diffX - diffY === 0;
};

const inCheck = (from: Square, to: Square, boardState: BoardState) => {
  return false;
}

const isValidKnightMove = ({ diffX, diffY}: Diffs) => {
  return (diffX === 2 && diffY === 1) || (diffX === 1 && diffY === 2);
}

const isValidKingMove = (from: Square, to: Square, boardState: BoardState, { diffX, diffY }: Diffs) => {
  return (diffX === 1 || diffY === 1);
}

const isValidPawnMove = (from: Square, to: Square, { turn, board }: BoardState, diffs: Diffs) => {
  const { diffY, diffX} = diffs;
  const [{ absRow: fromRow}, {absCol: toCol, absRow: toRow}] = [from, to];
  const rowDir = fromRow - toRow > 0 ? 1 : -1;
  const isValidDirection = (rowDir > 0 && turn) || (rowDir < 0 && !turn);
  const isValidNumSquares = (fromRow === (turn ? 6 : 1) && diffY <= 2) || diffY == 1;
  // TODO: incorporate en passant
  const isOneDiagonal = diffX === 1 && toRow === (fromRow + (turn ? - 1 : 1));
  const canTake = isOneDiagonal && board[toRow][toCol]?.color === (turn ? Black : White);
  return isValidDirection && isValidNumSquares && ((onCol(diffs) && !board[toRow][toCol]) || canTake);
}
// This will be a pretty complicated function, need to incorporate castling, en passant, knight moves, etc.
// probably should just calculate all possible squares and just containment conditional so that the
// logic of finding squares can be applied in the future to just the general experience - when a user
// selects a piece all valid squares for that piece are highlighted
export const isValidMove = (from: Square, to: Square, boardState: BoardState) => {
  const { board } = boardState;
  const [{ absCol: fromCol, absRow: fromRow}, {absCol: toCol, absRow: toRow}] = [from, to];
  const selectedPiece = board[fromRow][fromCol] as Piece;
  const { type, color } = selectedPiece;
  const diffs = getDiffs(from, to);
  if (isEqual(from, to) || (color === board[toRow][toCol]?.color) || inCheck(from, to, boardState)) {
    return false;
  }
  switch (type) {
    case Pawn:
      // TODO: incorporate en passant, one-directional rule, capturing, and max number of squares
      return isValidPawnMove(from, to, boardState, diffs);
    case Bishop:
      return onDiagonal(diffs) && !isBlocked(from, to, boardState, diffs);
    case Knight:
      return isValidKnightMove(diffs);
    case Rook:
        return (onCross(diffs)) && !isBlocked(from, to, boardState, diffs);
    case Queen:
        return (onDiagonal(diffs) || onCross(diffs)) && !isBlocked(from, to, boardState, diffs);
    case King:
        return isValidKingMove(from, to, boardState, diffs);
    default:
        return false;
  }
};