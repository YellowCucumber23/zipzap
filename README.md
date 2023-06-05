# Taser Chess
1. Arduino gets input from sensor in the form of 2-D Array
2. Parses the 2-D Array as a FEN
3. Sends the FEN and the move made over the NodeJs/Express Server through a websocket
4. Server process the data sent into the Arduino and uses node-uci to determine the score
5. When the side switches(when the button is pressed), the front end retrieves the FEN/Score from the server through the websocket to update the board/score on the screen
6. At the same time, the server will also send the score back to the arduino that will trigger the tens unit
