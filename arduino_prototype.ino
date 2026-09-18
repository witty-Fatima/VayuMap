void setup() {
  Serial.begin(9600);
}
void loop() {
  int A = analogRead(A0);
  int B = analogRead(A1);
  int C = analogRead(A2);
  int D = analogRead(A3);
  int E = analogRead(A4);
  Serial.print(A);
  Serial.print(",");
  Serial.print(B);
  Serial.print(",");
  Serial.print(C);
  Serial.print(",");
  Serial.print(D);
  Serial.print(",");
  Serial.println(E);
  delay(1000);
}