import pkg from 'node-uci'
import express from 'express';
import * as http from 'http';
import {Server} from "socket.io"
import { start } from 'repl';
// import { SerialPort } from 'serialport'
// import { ReadlineParser } from '@serialport/parser-readline'
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

//Send data to server
const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq e3 0 1"
const { Engine } = pkg;
const enginePath = "/opt/homebrew/bin/stockfish"
const engine = new Engine(enginePath)
await engine.init()
await engine.setoption('MultiPV', '10')
await engine.ucinewgame()

var frontEndData = {};

async function getScore(currentFen){
    await engine.isready()
    engine.position(currentFen)
    const result = await engine.go({depth: 3})

    frontEndData['move'] = result['bestmove']
    frontEndData['FEN'] = "r1bqkb1r/pppppppp/2n4n/8/5P1P/8/PPPPP1P1/RNBQKBNR w KQkq -"
    frontEndData['side'] = "white"
    //frontEndData['score'] = score of the previous move
    //frontEndData['board'] = object containing board

    return (frontEndData)
}

//Initialize sockets
io.on("connection", (socket) => {
    console.log('New client connected.');

    socket.on("send_side",() => {
        const promise = getScore(startFen)
        // promise.then(result => {
        //     socket.emit("recieve_side", result['side'])
        // }).catch(error => {
        //     console.error(error)
        //     socket.emit("recieve_side", error.message)
        // })
        socket.emit("recieve_side", "black")
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected.');
    });
})


server.listen(5000, () => {
    const resultPromise = getScore(startFen);

    resultPromise.then(result => {
        console.log(result)
    }).catch(error => {
        console.error(error);
    })
})



