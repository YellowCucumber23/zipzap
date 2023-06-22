#include <Arduino.h>

// put function declarations here:
String get_move(int board[8][8], int prev_board[8][8]);
void print_board(int board[8][8]);
bool compare_board(int cur[8][8], int prev[8][8]);

enum pieces{EMPTY, wP, wN, wB, wR, wQ, wK, bP, bN, bB, bR, bQ, bK};
char pieces[] = {'0', 'P', 'N', 'B', 'R', 'Q', 'K', 'P', 'N', 'B', 'R', 'Q', 'K'};

// int pot_pin = A0;
int percent = 0;
int prev_percent = 0;

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

String prev_move = "";   //Format: piece, from, x, to
String move;
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  
  Serial.println(get_move(cur_board, prev_board));
}

void loop() {
  // put your main code here, to run repeatedly:
  

  //Recieve input from sensors

  // Sending signals to server
  // if(compare_board(cur_board, prev_board) == false){
  //   move = get_move(cur_board, prev_board);
  // }

  // if(move != prev_move){
  //   Serial.println(move);
  //   prev_move = move;
  // }

  
  // Sending signal to relay units
  // if(Serial.available() > 0){
  //   String input_string = "";

  //   while(Serial.available() > 0){
  //     input_string += char(Serial.read());
  //   }

  //   if(input_string == "1"){
  //     digitalWrite(A0, HIGH);
  //   } else {
  //     digitalWrite(A0, LOW);
  //   }
  // }
  
}

// put function definitions here:
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