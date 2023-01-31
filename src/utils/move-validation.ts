import { findIndex2d } from './misc';
import { BOARD_SIDE_LEN, CASTLE_SHORT, CASTLE_LONG } from './../constants/board';
import type { PotentialMove, ValidMovesMap } from './../types/board';
import { getLastMove, inverseColor } from './board';
import { Pawn, Bishop, Knight, Rook, Queen, King, Black, White } from "../constants/board";
import type { Square, BoardState } from "../types/board";
import { inRange } from 'lodash';

const KING_DELTAS = [-1, 0, 1];
const KNIGHT_DELTAS = [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]];

type Diffs = {
  diffX: number,
  diffY: number,
}
// TOOD: instead of from, to, just use MoveInfo instead

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

const onDiagonal = ({ diffX, diffY }: Diffs) => {
  return diffX - diffY === 0;
};

// TODO: Calculate if King is in checkmate - this could be tricky because we need to validate four things
// 1. King is in check
// 2. King has no valid squares to move to
// 3. Checking piece can't be taken
// 4. King can't be blocked by another one of its pieces
// Because of this I might want to move to a new form of validation where all valid squares for every piece are
// calculated on every move (non-blocking, while players are playing) and then these calculations are used to make
// these decisions on time of move confirmation

// How to calculate this efficiently? Could iterate through every piece and check for contact with king... seems inefficient
// Better approach seems to be checking if the piece is pinned to its own king and then validating whether the king is in check
// An even better approach might be to iterate through all of the opponents pieces (max 16) and find all squares that are under
// their control after the theoretical board mutation and if that includes the king then the move is invalid.
export const inCheck = (boardState: BoardState) => {
  const { board, turn } = boardState;
  const [kingRow, kingCol] = findIndex2d(board, King, turn);
  const attackedSquares = Array.from(Array(8), () => new Array(8).fill(false) as boolean[]);
  console.log("fromHere");
  for (const [rowIdx, row] of board.entries()) {
    for (const [colIdx, piece] of row.entries()) {
      if (piece && piece.color === inverseColor(turn)) {
        const validMoves = getValidMoves(piece.type, {absRow: rowIdx, absCol: colIdx}, {...boardState, turn: inverseColor(turn)});
        console.log(piece, validMoves)
        // HUGE TODO: Attacked squares for pawns are different than all other pieces - need to incorporate
        // ITS A BUG that I haven't yet accounted for
        validMoves.forEach((validMove) => attackedSquares[validMove.absRow][validMove.absCol] = true);
      }
    }
  }
  return attackedSquares[kingRow][kingCol];
}

const getValidQueenMoves = (from: Square, boardState: BoardState) => {
  // Just get valid bishop moves and valid rook moves
  return [...getValidBishopMoves(from, boardState), ...getValidRookMoves(from, boardState)];
};

const getValidKnightMoves = ({absRow, absCol}: Square, boardState: BoardState) => {
  const moves: Square[] = [];
  KNIGHT_DELTAS.map(([dy, dx]) => {
    validateAndPush(moves, { absRow: absRow + dy, absCol: absCol + dx }, boardState);
  });
  return moves;
}

const validateAndPush = (moves: Square[], potential: Square, { board, turn }: BoardState) => {
  isInBounds(potential) && board[potential.absRow][potential.absCol]?.color !== turn && moves.push(potential);
}

const getValidKingMoves = (from : Square, boardState: BoardState): PotentialMove[] => {
  const { board, turn} = boardState;
  const moves: PotentialMove[] = [];
  KING_DELTAS.forEach((dy: number) => KING_DELTAS.forEach((dx) => {
    validateAndPush(moves, { absRow: from.absRow + dy, absCol: from.absCol + dx }, boardState)
  }));
  // Account for castling
  if (board[from.absRow][from.absCol]?.numMoves === 0) {
    // TODO: ENSURE no one is attacking the castle squares - currently unaccounted for
    // do this by augmenting the inCheck method to take a square to verify against and then just see if that square is
    // "in check" for each square between the rook and the king
    const toShortRook = {absRow: from.absRow, absCol: from.absCol + 3 };
    const shortCastleRook = board[from.absRow][from.absCol + 3];
    if (shortCastleRook && shortCastleRook.numMoves === 0 && !isBlocked(from, toShortRook, boardState, getDiffs(from, toShortRook))) {
      moves.push(CASTLE_SHORT[turn]);
    }
    const toLongRook = {absRow: from.absRow, absCol: from.absCol - 4};
    const longCastelRook = board[from.absRow][from.absCol - 4];
    console.log(longCastelRook);
    if (longCastelRook && longCastelRook.numMoves === 0 && !isBlocked(from, toLongRook, boardState, getDiffs(from, toLongRook))) {
      moves.push(CASTLE_LONG[turn]);
    }
  }
  return moves;
}

const isInBounds  = (square: Square) => inRange(square.absRow, 0, BOARD_SIDE_LEN) && inRange(square.absCol, 0, BOARD_SIDE_LEN);

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

const getValidPawnMoves = (from: Square, boardState: BoardState): PotentialMove[] => {
  const { turn } = boardState;
  const { absRow, absCol } = from;
  const checks = [
    { absRow: absRow + (turn ? -1 : 1), absCol }, // Forward 1
    { absRow: absRow + (turn ? -2 : 2), absCol }, // Forward 2
    { absRow: absRow + (turn ? -1 : 1), absCol: absCol + 1}, // Take or en passant
    { absRow: absRow + (turn ? -1 : 1), absCol: absCol - 1} // Take or en passant
  ]
  return checks.reduce((prev: PotentialMove[], check) => {
    const { absCol, absRow } = check;
    const { isValid, taken } = isValidPawnMove(from, check, boardState, getDiffs(from, check));
    return isValid ? [...prev, {absRow, absCol, taken}] : prev;
  }, []);
}

const getValidBishopMoves = (from: Square, boardState: BoardState) => {
  const { absRow, absCol } = from;
  const moves: Square[] = [];
  for (let i = 1; i < 8; i++) {
    validateAndPush(moves, { absRow: absRow + i, absCol: absCol + i }, boardState);
    validateAndPush(moves, { absRow: absRow - i, absCol: absCol + i }, boardState);
    validateAndPush(moves, { absRow: absRow + i, absCol: absCol - i }, boardState);
    validateAndPush(moves, { absRow: absRow - i, absCol: absCol - i }, boardState);
  }
  return moves.filter((potential) => !isBlocked(from, potential, boardState, getDiffs(from, potential)))
};

const getValidRookMoves = (from: Square, boardState: BoardState) => {
  const { absRow, absCol } = from;
  const moves: Square[] = [];
  for (let i = 0; i < 8; i++) {
    validateAndPush(moves, { absRow: absRow + i, absCol: absCol }, boardState);
    validateAndPush(moves, { absRow: absRow - i, absCol: absCol}, boardState);
    validateAndPush(moves, { absRow: absRow, absCol: absCol + i }, boardState);
    validateAndPush(moves, { absRow: absRow, absCol: absCol - i }, boardState);
  }
  return moves.filter((potential) => !isBlocked(from, potential, boardState, getDiffs(from, potential)));
}

const TYPE_TO_VALID_MOVES_CALLBACK: ValidMovesMap = {
  [Pawn]: getValidPawnMoves,
  [Bishop]: getValidBishopMoves,
  [Knight]: getValidKnightMoves,
  [Rook]: getValidRookMoves,
  [Queen]: getValidQueenMoves,
  [King]: getValidKingMoves
}

export const getValidMoves = (type: keyof ValidMovesMap, square: Square, boardState: BoardState): PotentialMove[] => {
  return TYPE_TO_VALID_MOVES_CALLBACK[type](square, boardState);
}