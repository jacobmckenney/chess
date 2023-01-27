import React from "react";
import useMeasure from "react-use-measure";

interface Props {
  gameId: string;
}

const Board: React.FC<Props> = ({ gameId }) => {
  const [ref, { height, width }] = useMeasure();
  const squareLen = Math.min(
    (height - height * 0.1) / 8,
    width - (height * 0.1) / 8
  );
  return (
    <div
      ref={ref}
      className="min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"
    >
      <div className="fixed top-5 right-1/2 flex translate-x-1/2 flex-col rounded-lg bg-black">
        {new Array(8).fill("").map((_, idx1) => {
          return (
            <div key={idx1} className="flex " style={{ height: squareLen }}>
              {new Array(8).fill("").map((_, idx2) => {
                return (
                  <div
                    className={`${
                      // Simplify this
                      idx1 % 2 == 0
                        ? idx2 % 2 == 1
                          ? "bg-white"
                          : "bg-black"
                        : idx2 % 2 == 1
                        ? "bg-black"
                        : "bg-white"
                    }`}
                    key={`${idx1}${idx2}`}
                    style={{ width: squareLen }}
                  >
                    idx
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;
