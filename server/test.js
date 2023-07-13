import {Chess} from "chess.js"

const chess = new Chess()

let move = 'Ng1xh3'

chess.move(move)

console.log(chess.ascii())