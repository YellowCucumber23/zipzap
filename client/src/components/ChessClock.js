import React, {useState, useEffect} from "react";
import "./ChessClock.css"

function ChessClock({socket}){
    const [side, setSide] = useState("Start")
    const [render, renderSide] = useState(0)

    useEffect(() => {
        socket.on('recieve_side', (data) => {
          setSide(data);
        });
    
        return () => {
          socket.disconnect();
        };
      }, [render]);


    return(
        <div>
            <div className="container">
                <div className="black-timer">
                    <div className="black-timer-info">
                        <h1>Black time</h1>
                        <button onClick={() => {
                            socket.emit("send_side")
                            renderSide(render+1)
                            }}>
                            Black Timer
                        </button>
                    </div>
                </div>

                
                <div className="header-container">
                    <div className="header-info">
                        <h1>Current Turn: {side}</h1>
                        <h1>Score: +0.34</h1>
                    </div>
                </div>

                <div className= "white-timer">
                        <div className="white-timer-info">
                        <h1>White time</h1>
                        <button onClick={() => socket.emit("send_side")}>
                        White Timer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChessClock