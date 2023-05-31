import pkg from 'node-uci'
import express from 'express';

const startFen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"


const { Engine } = pkg;
const enginePath = "/opt/homebrew/bin/stockfish"
const engine = new Engine(enginePath)
await engine.init()
await engine.setoption('MultiPV', '4')
await engine.ucinewgame()

const app = express()

async function getScore(){
    await engine.isready()
    engine.position(startFen)
    const result = await engine.go({depth: 3})
    console.log(result)

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

