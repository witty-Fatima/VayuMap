void setup() {
  Serial.begin(9600);
  delay(3000); // ignore boot garbage
}

void loop() {
  if (Serial.available()) {
    String line = Serial.readStringUntil('\n');
    line.trim();

    if (line.startsWith("A:")) {
      Serial.println(line); 
    }
  }
}