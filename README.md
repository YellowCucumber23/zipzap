# Taser Chess
This project makes people get better at chess by analyzing the move made and providing realtime feedback in the form of electric shock. Everything is controlled by the NodeJs server which communicates with the webpage and arduino using Sockets.io and the serial monitor. The webpage is built on ReactJs and is used to represent the current board state and sends a signal to the server when a players turn is over

## Usage: 
Before cloning, make sure to have Stockfish installed and change the directory in the `engine path` variable. Also, make sure that the path to the arduino is correct in the `serial port` object. After cloning the repository, run `npm install` to install dependencies and upload the code to the arduino. After plugging in the arduino to your computer, run the server first with `node` followed by the the webpage with `npm run start`


## Project Architechture
![Alt text](images/Basic%20Diagram.jpg?raw=true "Title")