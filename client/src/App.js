import React, {useEffect, useState} from "react";

function App(){
  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])

  return(
    <div>
      {backendData['info'][1]['score']['value']}
    </div>
  )
}

export default App