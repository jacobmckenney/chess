import { Piece, Color, Type} from "../types/board";
const { White, Black } = Color;
const { Pawn, Knight, Bishop, Rook, Queen, King} = Type;
export const PIECES = {
    WhitePawn: {color: White, type: Pawn, value: 1 },
    WhiteKnight: {color: White, type: Knight, value: 3 },
    WhiteBishop: {color: White, type: Bishop, value: 3 },
    WhiteRook: {color: White , type: Rook, value: 5 },
    WhiteQueen: {color:  White, type: Queen, value: 9 },
    WhiteKing: {color:  White, type: King, value: Number.POSITIVE_INFINITY },
    BlackPawn: {color:  Black, type: Pawn, value: 1 },
    BlackKnight: {color: Black, type: Knight, value: 3 },
    BlackBishop: {color: Black, type: Bishop, value: 3 },
    BlackRook: {color: Black, type: Rook, value: 5 },
    BlackQueen: {color: Black, type: Queen, value: 9 },
    BlackKing: {color: Black, type: King, value: Number.POSITIVE_INFINITY },
}

const {
    WhitePawn, WhiteBishop, WhiteKing, WhiteKnight, WhiteQueen, WhiteRook,
    BlackPawn, BlackBishop, BlackKing, BlackKnight, BlackQueen, BlackRook
} = PIECES;

export const INITIAL_BOARD = [
    BlackRook, BlackKnight, BlackBishop, BlackQueen, BlackKing, BlackBishop, BlackKnight, BlackRook,
    BlackPawn, BlackPawn, BlackPawn, BlackPawn, BlackPawn, BlackPawn, BlackPawn, BlackPawn,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
   WhitePawn, WhitePawn, WhitePawn, WhitePawn, WhitePawn, WhitePawn, WhitePawn, WhitePawn,
    WhiteRook, WhiteKnight, WhiteBishop, WhiteQueen, WhiteKing, WhiteBishop, WhiteKnight, WhiteRook
]