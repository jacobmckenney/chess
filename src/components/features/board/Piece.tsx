import React from "react";
import Image from "next/image";

interface Props {
  size: number;
  isWhite: boolean;
  piece: string;
}

const Piece: React.FC<Props> = ({ size, isWhite, piece }) => {
  const pieceColor = isWhite ? "white" : "black";
  return (
    <Image
      src={`/pieces/${pieceColor}/${piece}.png`}
      alt={`${pieceColor} ${piece}`}
      width={size}
      height={size}
    />
  );
};

export default Piece;
