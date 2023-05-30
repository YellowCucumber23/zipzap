import pkg from 'node-uci'
import express from 'express';

const { Engine } = pkg;
const somePath = "/opt/homebrew/bin/stockfish"
const engine = new Engine(somePath)

const app = express()

async function getScore(){
    await engine.init()
    const result = await engine.go({depth: 3})
    await engine.quit()
    return (result)
}


app.get("/api", (req, res) => {
    const resultPromise = getScore();

    resultPromise.then(result => {
        res.send(JSON.stringify(result));  
    }).catch(error => {
        console.error(error);
        res.status(500).send("An error occurred")
    })
})

app.listen(5000, () => {console.log("Server Started on 5000")})

