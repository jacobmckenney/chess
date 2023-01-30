import type { Color } from './../types/board';
import type { Piece, Type } from "../types/board";

export const reverse2d = <T = any>(arr: T[][]): T[][] => {
    const helper = <T>(a: T[]) => a.slice(0).reverse();
    return helper(arr).map(helper);
}

// TODO: generalize this
export const findIndex2d = (arr: (Piece | null)[][], type: Type, color: Color ): number[] => {
    for (let i = 0; i < arr.length; i++) {
        const find = arr[i].findIndex((value) => value ? (value.color === color && value.type === type) : false );
        if (find > -1) {
            return [i, find];
        }
    }
    return [-1, -1]
}