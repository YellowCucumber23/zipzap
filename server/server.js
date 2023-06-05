import pkg from 'node-uci'
import express from 'express';

const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq e3 0 1"


const { Engine } = pkg;
const enginePath = "/opt/homebrew/bin/stockfish"
const engine = new Engine(enginePath)
await engine.init()
await engine.setoption('MultiPV', '10')
await engine.ucinewgame()

const app = express()


var frontEndData = {};


//function take in serial input

//function to send to server
async function getScore(){
    await engine.isready()
    engine.position(startFen)
    const result = await engine.go({depth: 3})

    frontEndData['move'] = result['bestmove']
    frontEndData['FEN'] = "r1bqkb1r/pppppppp/2n4n/8/5P1P/8/PPPPP1P1/RNBQKBNR w KQkq -"
    //frontEndData['score'] = score of the previous move
    //frontEndData['board'] = object containing board

    return (frontEndData)
}


app.get("/api", (req, res) => {
    const resultPromise = getScore();

    resultPromise.then(result => {
        res.send(result)
    }).catch(error => {
        console.error(error);
        res.status(500).send("An error occurred")
    })
})

app.listen(5000, () => {console.log("Server Started on 5000")})

