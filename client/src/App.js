import "./App.css";
import React, {useEffect} from "react";
import ChessClock from "./components/ChessClock";
import {Chessboard} from "react-chessboard"
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App(){

  return(
    <div> 
      <div className= "board-container">
            <Chessboard/>
      </div>
      <ChessClock socket={socket}/>
    </div>
  )
}

export default App