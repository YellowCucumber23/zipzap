import {Chess} from "chess.js"

const chess = new Chess()

chess.move('Ng1xh3')
chess.move('Pd7xd5')
// chess.move('Pe4xd5')

console.log(chess.ascii())