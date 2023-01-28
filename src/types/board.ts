export enum Color {
    White = 0,
    Black = 1,
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

export type BoardState = {
    white: PublicUserInfo,
    black: PublicUserInfo,
    turn: Color,
    moves: Move[],
    board: Piece[][],
}

export type Piece = {
    color: Color,
    type: Type,
    value: number,
    //TODO: Valid movements
}

export type Move = {
    white: MoveInfo,
    black: MoveInfo
}

export type Square = {
    rank: number,
    file: number,
}

export type MoveInfo = {
    piece: Piece,
    from: Square,
    to: Square,
}