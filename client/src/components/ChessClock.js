import React, {useState} from "react";
import ChessClockTimer from "./ChessClockTimer";

function ChessClock(){
    const [side, setSide] = useState("White")

    return(
        <div>
            <ChessClockTimer currentSide={side}></ChessClockTimer>

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