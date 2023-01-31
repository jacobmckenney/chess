import type { Board, PotentialMove } from "../types/board";
import { Color, Type} from "../types/board";
export const { White, Black } = Color;
export const { Pawn, Knight, Bishop, Rook, Queen, King} = Type;
export const GET_PIECES = {
    WhitePawn: () => ({color: White, type: Pawn, value: 1, numMoves: 0}),
    WhiteKnight: () => ({color: White, type: Knight, value: 3, numMoves: 0 }),
    WhiteBishop: () => ({color: White, type: Bishop, value: 3, numMoves: 0 }),
    WhiteRook: () => ({color: White , type: Rook, value: 5, numMoves: 0 }),
    WhiteQueen: () => ({color:  White, type: Queen, value: 9, numMoves: 0 }),
    WhiteKing: () => ({color:  White, type: King, value: Number.POSITIVE_INFINITY, numMoves: 0 }),
    BlackPawn: () => ({color:  Black, type: Pawn, value: 1, numMoves: 0 }),
    BlackKnight: () => ({color: Black, type: Knight, value: 3, numMoves: 0 }),
    BlackBishop: () => ({color: Black, type: Bishop, value: 3, numMoves: 0 }),
    BlackRook: () => ({color: Black, type: Rook, value: 5, numMoves: 0 }),
    BlackQueen: () => ({color: Black, type: Queen, value: 9, numMoves: 0 }),
    BlackKing: () => ({color: Black, type: King, value: Number.POSITIVE_INFINITY, numMoves: 0 }),
}

const {
    WhitePawn, WhiteBishop, WhiteKing, WhiteKnight, WhiteQueen, WhiteRook,
    BlackPawn, BlackBishop, BlackKing, BlackKnight, BlackQueen, BlackRook
} = GET_PIECES;

export const INITIAL_BOARD: Board = [
    [BlackRook(), BlackKnight(), BlackBishop(), BlackQueen(), BlackKing(), BlackBishop(), BlackKnight(), BlackRook()],
    [BlackPawn(), BlackPawn(), BlackPawn(), BlackPawn(), BlackPawn(), BlackPawn(), BlackPawn(), BlackPawn()],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [WhitePawn(), WhitePawn(), WhitePawn(), WhitePawn(), WhitePawn(), WhitePawn(), WhitePawn(), WhitePawn()],
    [WhiteRook(), WhiteKnight(), WhiteBishop(), WhiteQueen(), WhiteKing(), WhiteBishop(), WhiteKnight(), WhiteRook()]
]

export const CASTLE_SHORT: {[key in Color]: PotentialMove} = {
    [White]: { absRow: 7, absCol: 6, additional: { piece: { type: Rook, color: White, value: 5, numMoves: 1 }, from: { absRow: 7, absCol: 7}, to: {absRow: 7, absCol: 5}}},
    [Black]: { absRow: 0, absCol: 6, additional: { piece: { type: Rook, color: Black, value: 5, numMoves: 1 }, from: { absRow: 0, absCol: 7}, to: {absRow: 0, absCol: 5}}}
}
export const CASTLE_LONG = {
    [White]: { absRow: 7, absCol: 2, additional: { piece: { type: Rook, color: White, value: 5, numMoves: 1 }, from: { absRow: 7, absCol: 0}, to: {absRow: 7, absCol: 3}}},
    [Black]: { absRow: 0, absCol: 2, additional: { piece: { type: Rook, color: Black, value: 5, numMoves: 1 }, from: { absRow: 0, absCol: 0}, to: {absRow: 0, absCol: 3}}}
}

export const BOARD_SIDE_LEN = INITIAL_BOARD.length;