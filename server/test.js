import {Chess} from "chess.js"

const chess = new Chess()

chess.move('e4')
chess.move('e5')
// chess.move('f4')
chess.move('Nf3')
chess.move("Bc5")

console.log(chess.ascii())