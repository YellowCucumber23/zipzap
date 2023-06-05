import "./App.css";
import React, {useState} from "react";
import {Chessboard} from "react-chessboard"
import ChessClock from "./components/ChessClock";
import {Chess} from "chess.js";


function App(){
  const [game, setGame] = useState(new Chess())


  return(
    <div>
      <ChessClock/>
    </div>
  )
}

export default App