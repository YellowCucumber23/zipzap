import React, {useEffect, useState} from "react";

function ChessClockTimer({currentSide}){
    const [blackTime, setBlackTime] = useState(5)
    const [whiteTime, setWhiteTime] = useState(5)

    useEffect(() => {
        let interval;

        if (currentSide === 'White') {
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
      },[currentSide]);

    return(
        <div>
            <h1>{whiteTime}</h1>
            <h1>{blackTime}</h1>
        </div>
    )
}

export default ChessClockTimer