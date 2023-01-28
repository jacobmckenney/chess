export enum Color {
    White = 1,
    Black = 0,
}

export enum Type {
    Pawn = "pawn",
    Knight = "knight",
    Bishop = "bishop",
    Rook = "rook",
    Queen = "queen",
    King = "king",
}

export type PublicUserInfo = {
    name: string,
    elo: number,
}

export type Board = (Piece | null)[][];

export type BoardState = {
    white: PublicUserInfo,
    black: PublicUserInfo,
    turn: Color,
    moves: Moves,
    board: Board,
}

export type Piece = {
    color: Color,
    type: Type,
    value: number,
    //TODO: Valid movements
}

export type Moves = {
    white: MoveInfo[],
    black: MoveInfo[],
    move: number;
}

export type Square = {
    absRow: number;
    absCol: number;
}

export type MoveInfo = {
    piece: Piece,
    from: Square,
    to: Square,
}

export type Selection = {
    selectedPiece: Piece,
    square: Square,
}