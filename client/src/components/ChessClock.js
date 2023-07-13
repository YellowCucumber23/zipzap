import React, {useState, useEffect} from "react";
import "./ChessClock.css"
import {Chessboard} from "react-chessboard"

function ChessClock({socket}){
    const [side, setSide] = useState("Start")
    const [render, renderSide] = useState(0)
    const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -");
    const [score, setScore] = useState(0)

    const [blackTime, setBlackTime] = useState(600)
    const [whiteTime, setWhiteTime] = useState(600)

    function setTime(time){
        let minutes = Math.floor(time / 60)
        let seconds = time % 60

        if (seconds < 10) {seconds = "0"+seconds;}
        return minutes + ':' + seconds
    }

    useEffect(() => {
        socket.on('recieve_side', (data) => {
          setSide(data);
          console.log("Data from recieve_side: ", data)
        });

        socket.on('recieve_fen', (data) => {
            setFen(data)
            console.log(data)
        })

        socket.on('recieve_score', (data) => {
            setScore(data)
            console.log(data)
        })

      }, [socket]);

    useEffect(() => {
        let interval;

        if (side === 'White') {
          interval = setInterval(() => {
            setWhiteTime((prevTime) => {
                if(prevTime > 0){
                    return prevTime - 1
                } else {
                    return prevTime
                }
            });
          }, 1000);
        } else if(side === 'Black'){
            interval = setInterval(() => {
                setBlackTime((prevTime) => {
                    if(prevTime > 0){
                        return prevTime - 1
                    } else {
                        return prevTime
                    }
                });
              }, 1000);
        }
        return () => clearInterval(interval);
    }, [side])

    return(
        <div>
            <div className= "board-container">
                <Chessboard position={fen}/>
            </div>
            <div className="container">
                <div className="black-timer">
                    <div className="black-timer-info">
                        <h1>{setTime(blackTime)}</h1>
                        <button onClick={() => {
                            socket.emit("get_move");
                            socket.emit("send_shock");
                            socket.emit("send_side");
                            socket.emit("send_fen");
                            socket.emit("send_score");
                            renderSide(render+1)
                            }}>
                            Black End Turn
                        </button>
                    </div>
                </div>

                
                <div className="header-container">
                    <div className="header-info">
                        <h1>Current Turn: {side}</h1>
                        <h1>Score: {score}</h1>
                        <button onClick={() => setSide("White")}>Start Game</button>
                    </div>
                </div>

                <div className= "white-timer">
                        <div className="white-timer-info">
                        <h1>{setTime(whiteTime)}</h1>
                        <button onClick={() => {
                            socket.emit("get_move")
                            socket.emit("send_shock");
                            socket.emit("send_side");
                            socket.emit("send_fen");
                            socket.emit("send_score");
                            renderSide(render+1)
                            }}>
                        White End Turn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChessClock