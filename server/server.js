import pkg from 'node-uci'
import express from 'express';
import * as http from 'http';
import {Server} from "socket.io"
import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import {Chess} from "chess.js"

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
const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
const fen1 = "rnb1kb1r/ppppqppp/8/8/2BN4/8/PPPn1PPP/RNB1K2R w KQkq -"
const chess = new Chess(fen1);
const { Engine } = pkg;
const enginePath = "/opt/homebrew/bin/stockfish"
const engine = new Engine(enginePath)
await engine.init()
await engine.setoption('MultiPV', '10')
await engine.ucinewgame()

function getSide(currentFen){
    for(var i = 0; i < currentFen.length; i++){
        if(currentFen.charAt(i) == " "){
            if(currentFen.charAt(i+1) === "w"){
                return "White";
            } else if(currentFen.charAt(i+1) === "b"){
                return "Black";
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

    //Client signals that turn is over and to send shock signal to arduino
    socket.on("send_arduino_score",() => {
        //get the move made from arduino

        //send signals back to arduino
        const promise = getFrontEndData(chess.fen())
        promise.then(result => {
            if(result['score'] < 0) {
                console.log("send black shock signal")
                serialport.write("1")     //Send signal to serialport
            } else {
                console.log("send white shock signal")
                serialport.write("0")
            }
        }).catch(error => {
            console.error(error)
        })
    });

    //client sends signal to send the side
    socket.on("send_side",() => {
        const promise = getFrontEndData(chess.fen())
        promise.then(result => {
            socket.emit("recieve_side", result['side'])   //Server sends side to client
        }).catch(error => {
            console.error(error)
            socket.emit("recieve_side", error.message)
        })
    });

    //client sends signal to send the fen
    socket.on("send_fen",() => {
        const promise = getFrontEndData(chess.fen())
        promise.then(result => {
            socket.emit("recieve_fen", result['FEN'])  //Server sends the fen to client
        }).catch(error => {
            console.error(error)
            socket.emit("recieve_fen", error.message)
        })
    });

    //client sends signal to send the score to display
    socket.on("send_score", () => {
        const promise = getFrontEndData(chess.fen())
        promise.then(result => {
            socket.emit("recieve_score", result['score']) //Server sends score to client
        }).catch(error => {
            console.error(error)
            socket.emit("recieve_score", error.message)
        })
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected.');
    });
})


server.listen(5000, () => {
    const resultPromise = getFrontEndData(chess.fen());

    resultPromise.then(result => {
        console.log(result)
    }).catch(error => {
        console.error(error);
    })
})



