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
    numMoves: number,
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

export type UpdateBoardArgs = {
    piece: Piece | null,
    isSelected: boolean,
    to: Square,
    boardState: BoardState,
    selected: Square | null,
    setSelected: React.Dispatch<React.SetStateAction<Square | null>>,
    setBoardState: React.Dispatch<React.SetStateAction<BoardState>>,
}

export type MoveValidateReturn = {
    taken?: Square,
    isValid: boolean,
}
