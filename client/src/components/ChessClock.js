import React, {useState, useEffect} from "react";
import "./ChessClock.css"

function ChessClock(){
    const [side, setSide] = useState("Start")
    const [blackTime, setBlackTime] = useState(600)
    const [whiteTime, setWhiteTime] = useState(600)
    const [backendData, setBackendData] = useState({})

    function setTime(time){
        let minutes = Math.floor(time / 60)
        let seconds = time % 60

        if (seconds < 10) {seconds = "0"+seconds;}
        return minutes + ':' + seconds
    }

    useEffect(() => {
        let interval;

        fetch("/api").then(
            response => response.json()
          ).then(
            data => {
              setBackendData(data)
            }
          )

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
      },[side]);

    return(
        <div className="container">

            <div className="black-timer">
                <div className="black-timer-info">
                    <h1>{setTime(blackTime)}</h1>
                    <button onClick = {() => setSide("Black")}>
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
                    <h1>{setTime(whiteTime)}</h1>
                    <button onClick = {() => setSide("White")}>
                    White Timer
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ChessClock