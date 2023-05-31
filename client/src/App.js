import React, {useEffect, useState} from "react";
import ChessClock from "./components/ChessClock"

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
      <ChessClock></ChessClock>
    </div>
  )
}

export default App