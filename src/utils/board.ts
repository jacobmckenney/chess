import type { MoveInfo, Moves } from './../types/board';
import { Black, White } from "../constants/board";
import type { Color } from "../types/board";

export const inverseColor = (color: Color) => color === White ? Black : White

export const getLastMove = ({ white, black }: Moves, turn: Color): MoveInfo | null => {
    const moveArr = turn ? black : white;
    return moveArr[moveArr.length - 1];
}