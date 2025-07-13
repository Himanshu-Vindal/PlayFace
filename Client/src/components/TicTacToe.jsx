import { useEffect, useState } from "react";
import { socket } from "../socket";

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [roomId, setRoomId] = useState("");
    const [joined, setJoined] = useState(false);
    const [isX, setIsX] = useState(true);
    const [symbol, setSymbol] = useState(""); // "X" or "O"
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        socket.on("symbol", (sym) => setSymbol(sym));
        socket.on("room-full", () => alert("Room is full!"));

        socket.on("opponent-move", (newBoard) => {
            setBoard(newBoard);
            setIsX(true);
            const result = checkWinner(newBoard);
            if (result) setWinner(result);
        });

        return () => {
            socket.off("symbol");
            socket.off("room-full");
            socket.off("opponent-move");
        };
    }, []);

    const joinRoom = () => {
        if (!roomId) return;
        socket.emit("join-room", roomId);
        setJoined(true);
    };


    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setIsX(symbol === "X"); // reset to your turn if you're X
    };


    const checkWinner = (board) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        for (let [a, b, c] of lines) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // X or O
            }
        }

        if (board.every(cell => cell)) {
            return "Draw";
        }

        return null;
    };


    const handleClick = (i) => {
        if (board[i] || !joined || !isX) return;
        const newBoard = [...board];
        newBoard[i] = symbol;
        setBoard(newBoard);
        setIsX(false);
        const result = checkWinner(newBoard);
        if (result) setWinner(winner);

        socket.emit("make-move", { roomId, board: newBoard });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600 flex items-center justify-center p-4">
            <div className="bg-gray-50 rounded-3xl p-6 shadow-[8px_8px_16px_rgba(0,0,0,0.05),-8px_-8px_16px_rgba(255,255,255,0.7)] animate__animated animate__fadeIn">
                {!joined ? (
                    <div className="text-center space-y-4 animate__animated animate__zoomIn">
                        <h2 className="text-2xl font-medium text-gray-700 animate__animated animate__bounceIn">Join a Room</h2>
                        <input
                            type="text"
                            className="border px-4 py-2 rounded-full w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter Room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <button
                            onClick={joinRoom}
                            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-[length:200%_200%] text-white font-semibold rounded-full px-6 py-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg animate__animated animate__pulse"
                        >
                            Join
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4 animate__animated animate__fadeInDown">
                            <span className="text-gray-700 font-medium">Room: {roomId}</span>
                            <span className="text-gray-700 font-medium">You: {symbol}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 animate__animated animate__zoomIn">
                            {board.map((cell, i) => (
                                <div
                                    key={i}
                                    className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl font-bold transition-transform duration-200 transform hover:scale-105 active:scale-95 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.7)] animate__animated animate__bounceIn"
                                    onClick={() => handleClick(i)}
                                >
                                    {cell}
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-gray-600 text-center animate__animated animate__fadeInUp">
                            {isX ? "Your Turn" : "Opponent's Turn"}
                        </p>
                    </>
                )
                }

                {winner && (
                    <div className="mt-6 text-center animate__animated animate__fadeInDown">
                        <h2 className="text-2xl font-bold text-green-600">
                            {winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}
                        </h2>
                        <button
                            onClick={resetGame}
                            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-full animate__animated animate__bounceIn hover:scale-105 transition-transform"
                        >
                            Play Again
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default TicTacToe;
