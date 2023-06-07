import "./App.css";
import React from "react";
import ChessClock from "./components/ChessClock";

import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App(){

  return( 
    <div> 
      <ChessClock socket={socket}/>
    </div>
  )
}
export default App