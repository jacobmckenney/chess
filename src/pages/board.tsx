import React from "react";
import useMeasure from "react-use-measure";
import Image from "next/image";
import Piece from "../components/features/board/Piece";

interface Props {
  gameId: string;
  isWhite: boolean;
}

const colToFile = (col: number) => {
  return String.fromCharCode(col + 65);
};

const Board: React.FC<Props> = ({ gameId, isWhite = false }) => {
  const [ref, { height, width }] = useMeasure();
  const boardLen = Math.min(height - height * 0.1, width - width * 0.1);
  const squareLen = boardLen / 8;
  const pieceSize = squareLen * 0.9;
  return (
    <div
      ref={ref}
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"
    >
      <div
        className=" grid grid-cols-8 bg-black"
        style={{ width: boardLen, height: boardLen }}
      >
        {new Array(64).fill(null).map((_, idx) => {
          const blackRow = Math.floor(idx / 8);
          const row = isWhite ? 7 - blackRow : blackRow;
          const rank = row + 1;
          const whiteFile = idx % 8;
          const file = colToFile(isWhite ? whiteFile : 7 - whiteFile);
          return (
            <div
              className={`relative flex items-center justify-center text-blue-400 ${
                (idx % 2 === row % 2) == isWhite ? "bg-black" : "bg-white"
              }`}
              key={idx}
            >
              <div className="absolute top-0 left-0 text-sm">{`${file}${rank}`}</div>
              <Piece size={pieceSize} isWhite={true} piece="knight" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;
