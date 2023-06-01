import "./App.css";
import React, {useEffect, useState} from "react";
import {Chessboard} from "react-chessboard"
import ChessClock from "./components/ChessClock";

function App(){
  const [backendData, setBackendData] = useState([{}])

  // useEffect(() => {
  //   fetch("/api").then(
  //     response => response.json()
  //   ).then(
  //     data => {
  //       setBackendData(data)
  //     }
  //   )
  // }, [])

  return(
    <div>
      <div className= "board-container">
        <Chessboard/>
      </div>
      <ChessClock/>
    </div>
  )
}

export default App