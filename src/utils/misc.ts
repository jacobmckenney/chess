import type { Board, Color, Square } from './../types/board';
import type { Piece, Type } from "../types/board";

export const reverse2d = <T = any>(arr: T[][]): T[][] => {
    const helper = <T>(a: T[]) => a.slice(0).reverse();
    return helper(arr).map(helper);
}

// TODO: generalize this
export const findPiece = (board: Board, type: Type, color: Color ): Square => {
    for (let i = 0; i < board.length; i++) {
        const find = board[i].findIndex((value) => value ? (value.color === color && value.type === type) : false );
        if (find > -1) {
            return { absRow: i, absCol: find};
        }
    }
    return { absRow: -1, absCol: -1};
}