#include <Arduino.h>

// put function declarations here:
String get_move(int board[8][8]);

enum pieces{EMPTY, wP, wN, wB, wR, wQ, wK, bP, bN, bB, bR, bQ, bK};
// int pot_pin = A0;
int percent = 0;
int prev_percent = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(A0, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  /*
  1. Detect what move was made and create the fen
  2. send the fen over to server
  3. recieve the shocking signal
  4. shock the boi
  */



  // Sending stuff to server
  // percent = round(analogRead(pot_pin) / 1024.0 * 100);

  // if(prev_percent != percent){
  //   Serial.println(percent);
  //   prev_percent = percent;
  // }
  // delay(100);

  // int score = 0;

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
String get_move(int board[8][8]){
}