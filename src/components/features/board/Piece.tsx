import React from "react";
import Image from "next/image";
import { Piece } from "../../../types/board";

interface Props {
  onClick: () => any;
  size: number;
  piece: Piece;
}

const Piece: React.FC<Props> = ({ onClick, size, piece }) => {
  const { type, color } = piece;
  const pieceColor = color ? "black" : "white";
  return (
    <Image
      onClick={onClick}
      src={`/pieces/${pieceColor}/${type}.png`}
      alt={`${pieceColor} ${type}`}
      width={size}
      height={size}
    />
  );
};

export default Piece;
