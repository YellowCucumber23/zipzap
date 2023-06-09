import pkg from 'node-uci'
import express from 'express';
import * as http from 'http';
import {Server} from "socket.io"
import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

//Global Stuff
var frontEndData = {};
var prevScore = 0;

//Chess Stuff
const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq e3 0 1"
const fen1 = "rnbqkbnr/p1p2ppp/4p3/1p1p4/4P3/2NB4/PPPP1PPP/R1BQK1NR w KQkq -"
const { Engine } = pkg;
const enginePath = "/opt/homebrew/bin/stockfish"
const engine = new Engine(enginePath)
await engine.init()
await engine.setoption('MultiPV', '10')
await engine.ucinewgame()

function getSide(currentFen){
    for(var i = 0; i < currentFen.length; i++){
        if(currentFen.charAt(i) == " "){
            if(currentFen.charAt(i+1) === "b"){
                return "Black";
            } else if(currentFen.charAt(i+1) === "w"){
                return "White";
            }
        }
    }
}

function getScore(engineInfo, side){

    let scoreArray = [];
    for(var i  = 1; i < engineInfo['info'].length; i++){
        scoreArray.push(engineInfo['info'][i]['score']['value'])
    }
    scoreArray = scoreArray.sort(function(a, b){return a-b})

    if(side === 'White'){
        return scoreArray[scoreArray.length - 1] / 100.0
    } else {
        return scoreArray[0]/100.0
    }
}


async function getFrontEndData(currentFen){
    await engine.isready()
    parser.on("data", (data) => {
        frontEndData['test'] = data
    })
    engine.position(currentFen)
    const result = await engine.go({depth: 3})
    frontEndData['move'] = result['bestmove']
    frontEndData['FEN'] = currentFen
    frontEndData['side'] = getSide(currentFen)
    frontEndData['score'] = getScore(result, frontEndData['side'])

    return (frontEndData)
}

//Serial port
const serialport = new SerialPort({ path: '/dev/cu.usbmodem21301', baudRate: 9600 })
const parser = serialport.pipe(new ReadlineParser({ delimiter: '\r\n' }));

//Initialize sockets
io.on("connection", (socket) => {
    console.log('New client connected:', socket.id );

    socket.on("send_test",() => {
        const promise = getFrontEndData(fen1)
        promise.then(result => {
            socket.emit("recieve_test", result['test'])
        }).catch(error => {
            console.error(error)
            socket.emit("recieve_test", error.message)
        })
    });

    socket.on("send_side",() => {
        const promise = getFrontEndData(fen1)
        promise.then(result => {
            socket.emit("recieve_side", result['side'])
        }).catch(error => {
            console.error(error)
            socket.emit("recieve_side", error.message)
        })
    });

    socket.on("send_fen",() => {
        const promise = getFrontEndData(fen1)
        promise.then(result => {
            socket.emit("recieve_fen", result['FEN'])
        }).catch(error => {
            console.error(error)
            socket.emit("recieve_fen", error.message)
        })
    });

    socket.on("send_score", () => {
        const promise = getFrontEndData(fen1)
        promise.then(result => {
            socket.emit("recieve_score", result['score'])
        }).catch(error => {
            console.error(error)
            socket.emit("recieve_score", error.message)
        })
    })

    socket.on("turn_on_led", () => {
        serialport.write("1")
    })

    socket.on("turn_off_led", () => {
        serialport.write("0")
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected.');
    });
})


server.listen(5000, () => {
    const resultPromise = getFrontEndData(fen1);

    resultPromise.then(result => {
        console.log(result)
    }).catch(error => {
        console.error(error);
    })
})



