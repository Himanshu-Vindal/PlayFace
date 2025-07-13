import { useEffect, useState } from "react";
import { socket } from "../socket";
const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [roomId, setRoomId] = useState("");
    const [joined, setJoined] = useState(false);
    const [isX, setIsX] = useState(true);

    useEffect(() => {
        socket.on("opponent-move", (newBoard) => {
            setBoard(newBoard);
            setIsX(true);
        });

        return () => {
            socket.off("opponent-move");
        };
    }, []);

    const joinRoom = () => {
        if (roomId) {
            socket.emit("join-room", roomId);
            setJoined(true);
        }

    }

    const handleClick = (index) => {
        if (board[index] || !joined || !isX) return;

        const newBoard = [...board];

        newBoard[index] = "X"
        setBoard(newBoard);
        setIsX(false);

        socket.emit("make-move", { roomId, board: newBoard });
    }




    return (
        <div className="max-w-md mx-auto p-6 text-center">
            {!joined ?
                (<>
                    <h2 className="text-xl mb-2">Join a Room</h2>
                    <input
                        type="text"
                        className="border px-2 py-1"
                        value={roomId}
                        placeholder="Enter Room ID"
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                    <button
                        onClick={joinRoom}
                        className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Join
                    </button>
                </>
                ) :

                (<>
                    <h2 className="text-xl mb-4">Room ID: {roomId}</h2>
                    <div className="grid grid-cols-3 gap-2">
                        {board.map((cell, i) => (
                            <div
                                key={i}
                                className="w-20 h-20 border flex items-center justify-center text-2xl bg-gray-100 rounded"
                                onClick={() => handleClick(i)}
                            >
                                {cell}
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-gray-500">
                        {isX ? "Your Turn" : "Opponent's Turn"}
                    </p>
                </>
                )
            }



        </div>
    )
}

export default TicTacToe