// Portable Game Notation (pgn)
// Example from Chess.com:
//
// [Event "Live Chess"]
// [Site "Chess.com"]
// [Date "2023.01.05"]
// [Round "?"]
// [White "NoHoneyBear"]
// [Black "jacobmck"]
// [Result "0-1"]
// [ECO "B07"]
// [WhiteElo "848"]
// [BlackElo "908"]
// [TimeControl "600"]
// [EndTime "11:08:50 PST"]
// [Termination "jacobmck won on time"]

// 1. e4 d6 2. d4 Nf6 3. f3 g6 4. g4 Bg7 5. g5 Nfd7 6. c4 e5 7. d5 O-O 8. h4 h5 9.
// Qe2 Nc5 10. Bh3 Bxh3 11. Nxh3 f6 12. b4 Ncd7 13. b5 Nc5 14. Bd2 fxg5 15. Bxg5
// Bf6 16. Qg2 Kh7 17. Kd2 Rf7 18. Nc3 Qf8 19. Rhf1 Nbd7 20. a4 Nb3+ 21. Kd3 Nxa1
// 22. Rxa1 Kg7 23. f4 Bxg5 24. fxg5 Rf3+ 25. Kc2 Nc5 26. Kb2 Nd3+ 27. Kc2 a6 28.
// Rd1 Nc5 29. Ng1 Rf2+ 30. Qxf2 Qxf2+ 31. Rd2 Qxg1 32. Ne2 Qg4 0-1

export const pgnToBoardState = (pgn: string) => {
    return {};
}