import type { MoveValidateReturn } from './../types/board';
import { getLastMove } from './board';
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

// How to calculate this efficiently? Could iterate through every piece and check for contact with king... seems inefficient
// Better approach seems to be checking if the piece is pinned to its own king and then validating whether the king is in check
// An even better approach might be to iterate through all of the opponents pieces (max 16) and find all squares that are under
// their control after the theoretical board mutation and if that includes the king then the move is invalid.
const inCheck = (from: Square, to: Square, boardState: BoardState) => {
  return false;
}

const isValidQueenMove = (from: Square, to: Square, boardState: BoardState, diffs: Diffs) => ({ isValid: (onCol(diffs) || onDiagonal(diffs)) && !isBlocked(from, to, boardState, diffs)});

const isValidKnightMove = ({ diffX, diffY}: Diffs) => {
  return { isValid: (diffX === 2 && diffY === 1) || (diffX === 1 && diffY === 2) };
}

const isValidKingMove = (from: Square, to: Square, boardState: BoardState, { diffX, diffY }: Diffs) => {
  return { isValid: (diffX === 1 || diffY === 1) };
}

const isValidPawnMove = (from: Square, to: Square, { turn, board, moves }: BoardState, diffs: Diffs) => {
  const lastMove = getLastMove(moves, turn);
  const { diffY, diffX} = diffs;
  const [{ absRow: fromRow}, {absCol: toCol, absRow: toRow}] = [from, to];
  const rowDir = fromRow - toRow > 0 ? 1 : -1;
  const isValidDirection = (rowDir > 0 && turn) || (rowDir < 0 && !turn);
  const isValidNumSquares = (fromRow === (turn ? 6 : 1) && diffY <= 2) || diffY == 1;
  const isOneDiagonal = diffX === 1 && toRow === (fromRow + (turn ? - 1 : 1));
  const epTakenRow = toRow + (turn ? 1 : -1);
  const takenPieceEP = board[epTakenRow][toCol];
  const epLastMoveAndPawn = (lastMove && lastMove.to.absRow === epTakenRow && lastMove.to.absCol === toCol && takenPieceEP?.type === Pawn) ?? false;
  const isTakingEnPassant = (turn ? fromRow === 3 : fromRow === 4) && epLastMoveAndPawn;
  const canTake = (isOneDiagonal && board[toRow][toCol]?.color === (turn ? Black : White)) || isTakingEnPassant;
  const isValid = isValidDirection && isValidNumSquares && ((onCol(diffs) && !board[toRow][toCol]) || canTake);
  return { isValid, ...(isTakingEnPassant && {taken: { absRow: epTakenRow, absCol: toCol}}) };
}

const isValidBishopMove = (from: Square, to: Square, boardState: BoardState, diffs: Diffs) => ({ isValid: onDiagonal(diffs) && !isBlocked(from, to, boardState, diffs)})
const isValidRookMove = (from: Square, to: Square, boardState: BoardState, diffs: Diffs) => ({ isValid: (onCross(diffs)) && !isBlocked(from, to, boardState, diffs)})

// This will be a pretty complicated function, need to incorporate castling, en passant, knight moves, etc.
// probably should just calculate all possible squares and just containment conditional so that the
// logic of finding squares can be applied in the future to just the general experience - when a user
// selects a piece all valid squares for that piece are highlighted
const isValidMoveHelper = (from: Square, to: Square, boardState: BoardState): MoveValidateReturn => {
  const { board } = boardState;
  const [{ absCol: fromCol, absRow: fromRow}, {absCol: toCol, absRow: toRow}] = [from, to];
  const selectedPiece = board[fromRow][fromCol] as Piece;
  const { type, color } = selectedPiece;
  const diffs = getDiffs(from, to);
  if (isEqual(from, to) || (color === board[toRow][toCol]?.color)) {
    return { isValid: false }
  }
  switch (type) {
    case Pawn:
      return isValidPawnMove(from, to, boardState, diffs);
    case Bishop:
      return isValidBishopMove(from, to, boardState, diffs);
    case Knight:
      return isValidKnightMove(diffs);
    case Rook:
        return isValidRookMove(from, to, boardState, diffs);
    case Queen:
        return isValidQueenMove(from, to, boardState, diffs);
    case King:
        return isValidKingMove(from, to, boardState, diffs);
    default:
        return { isValid: false };
  }
};

export const isValidMove = (from: Square, to: Square, boardState: BoardState): MoveValidateReturn => {
  const { isValid, taken} = isValidMoveHelper(from, to, boardState);
  return { isValid: isValid && !inCheck(from, to, boardState), taken}
}