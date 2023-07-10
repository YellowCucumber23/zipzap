#include <Arduino.h>

/*GLOBAL VARIABLES*/
enum pieces{EMPTY, wP, wN, wB, wR, wQ, wK, bP, bN, bB, bR, bQ, bK};
char pieces[] = {'0', 'P', 'N', 'B', 'R', 'Q', 'K', 'P', 'N', 'B', 'R', 'Q', 'K'};
int sensor_board[8][8] = {
  {23,25,27,29,31,33,35,37},
  {39,41,43,45,47,49,51,53},
  {22,24,26,28,30,32,34,36},
  {38,40,42,44,46,48,50,52},
  {14,15,16,17,18,19,20,21},
  { 2, 3, 4, 5, 6, 7, 8, 9},
  {10,11,12,13,A0,A1,A2,A3},
  {A4,A5,A6,A7,A8,A9,A10,A11}
};

int cur_board[8][8] = {
  {wR, wN, wB, wQ, wK, wB, EMPTY, wR}, 
  {wP, wP, wP, wP, wP, wP, wP, wP}, 
  {EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, wN}, 
  {EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY}, 
  {EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY}, 
  {EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY}, 
  {bP, bP, bP, bP, bP, bP, bP, bP}, 
  {bR, bN, bB, bQ, bK, bB, bN, bR}
};

int prev_board[8][8] = {
  {wR, wN, wB, wQ, wK, wB, wN, wR}, 
  {wP, wP, wP, wP, wP, wP, wP, wP}, 
  {EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY}, 
  {EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY}, 
  {EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY}, 
  {EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY}, 
  {bP, bP, bP, bP, bP, bP, bP, bP}, 
  {bR, bN, bB, bQ, bK, bB, bN, bR}
};

String prev_move = "";
String move;
int percent = 0;
int prev_percent = 0;

int led_pin = A9;
int button_pin = A0;


/*FUNCTION DECLARATIONS*/
String get_move(int board[8][8], int prev_board[8][8]);
void print_board(int board[8][8]);
bool compare_board(int cur[8][8], int prev[8][8]);

/*SETUP FUNCTION*/
void setup() {
  Serial.begin(9600);
  pinMode(led_pin, OUTPUT);
  pinMode(button_pin, INPUT_PULLUP);

  // for(int i = 7; i >= 0; --i){
  //   for(int j = 0; j < 8; ++j){
  //     pinMode(sensor_board[i][j], INPUT_PULLUP);
  //   }
  // }
  
}

/*MAIN FUNCTION*/
void loop() {
  int state = digitalRead(button_pin);

	if (state == LOW) {
    digitalWrite(led_pin, HIGH);
    if(compare_board(cur_board, prev_board) == false){  //Compare the board and get the move
      move = get_move(cur_board, prev_board);
    }

    if(move != prev_move){     //Only print if the previous move is not the same
      Serial.println(move);
      prev_move = move;
    }

    if(Serial.available() > 0){    //Recieve the the shock signal from the server
      String input_string = "";

      while(Serial.available() > 0){
        input_string += char(Serial.read());
      }

      if(input_string == "1"){
        // digitalWrite(A0, HIGH);
      } else {
        // digitalWrite(A0, LOW);
      }
    }
	}
	else {
    digitalWrite(led_pin,LOW);
	}
  
}

/*FUNCTION DEFINITIONS*/
String get_move(int board[8][8], int prev_board[8][8]){
  char piece = ' ';
  String from = "";
  String to = "";

  for(int i = 7; i >= 0; --i){
    for(int j = 0; j < 8; ++j){
      if(prev_board[i][j] != board[i][j]){
        if(board[i][j] == EMPTY){
          from += String(char('a' + j));
          from += String(i+1);
        } else {
          to += String(char('a' + j));
          to += String(i+1);
          piece = pieces[board[i][j]];
        }
      }
    }
  }
  String out = String(piece) + from + "x" + to;

  return out;
}

void print_board(int board[8][8]){
  Serial.println();
  for(int i = 7; i >= 0; --i){
    for(int j = 0; j < 8; ++j){
      Serial.print(board[i][j]);
      Serial.print(" ");
    }
    Serial.println();
  }
}

bool compare_board(int cur[8][8], int prev[8][8]){
  for(int i = 0; i < 8; ++i){
    for(int j = 0; j < 8;++j){
      if(cur[i][j] != prev[i][j]){
        return false;
      }
    }
  }

  return true;
}