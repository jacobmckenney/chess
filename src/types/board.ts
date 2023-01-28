export enum Color {
    White,
    Black
}

export enum PieceType {
    Pawn,
    Bishop,
    Knight,
    Rook,
    Queen,
    King
}

const { White, Black } = Color;
const { Pawn, Bishop, Knight, Rook, Queen, King } = PieceType

export const pieceTypes = {
    whitePawn: {color: White, value: 1, type: Pawn },
    whiteBishop: {color: White, value: 3, type: Bishop },
    whiteKnight: {color: White, value: 3, type: Knight },
    whiteRook: {color: White, value: 5, type: Rook },
    whiteQueen: {color: White, value: 9, type: Queen },
    whiteKing: {color: White, value: Number.POSITIVE_INFINITY, type: King },
    blackPawn: {color: Black, value: 1, type: Pawn },
    blackBishop: {color: Black, value: 3, type: Bishop },
    blackKnight: {color: Black, value: 3, type: Knight },
    blackRook: {color: Black, value: 5, type: Rook },
    blackQueen: {color: Black, value: 9, type: Queen },
    blackKing: {color: Black, value: Number.POSITIVE_INFINITY, type: King }
}

export type Piece = {
    type: string,
    value: number,
    color: number,
}