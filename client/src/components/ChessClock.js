import React, {useState, useEffect} from "react";
import "./ChessClock.css"

function ChessClock(){
    const [side, setSide] = useState("White")
    const [blackTime, setBlackTime] = useState(10)
    const [whiteTime, setWhiteTime] = useState(10)

    function setTime(time){
        let minutes = Math.floor(time / 60)
        let seconds = time % 60

        if (seconds < 10) {seconds = "0"+seconds;}
        return minutes + ':' + seconds
    }

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
        } else {
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
            <h1>Current Turn: {side}</h1>
            <div>
                <h1>{setTime(whiteTime)}</h1>
                <h1>{setTime(blackTime)}</h1>
            </div>

            <button onClick = {() => setSide("Black")}>
                Black Timer
            </button>

            <button onClick = {() => setSide("White")}>
                White Timer
            </button>
        </div>
    )
}

export default ChessClock