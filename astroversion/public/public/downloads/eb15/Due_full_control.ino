// Arduino Due — I2C tester (Wire on SDA/SCL) with FAN + GRIP + TEST/TEST1 + WAKE
// Wiring: Due SDA/SCL <-> level shifter (LV) <-> Mega D20/D21 (HV). Common GND.

#include <Wire.h>

const uint8_t MEGA_ADDR = 8;         // Mega I2C address
const char* AXES = "XYZAB";          // X,Y,Z,A(E0),B(E1) on RAMPS
float defaultAngleDeg = 10.0;
const bool VERBOSE_I2C = true;

// -------- dual-port print helpers (Programming + Native USB) --------
void printBoth(const String& s){ if (Serial) Serial.println(s); if (SerialUSB) SerialUSB.println(s); }
void printBothNoNL(const String& s){ if (Serial) Serial.print(s); if (SerialUSB) SerialUSB.print(s); }

// Robust line read (works with any line ending; idle timeout allows “No line ending”)
String readLineAny(unsigned long idle_timeout_ms = 400) {
  String s; unsigned long last_rx = millis();
  for (;;) {
    if (s.length() && (millis() - last_rx >= idle_timeout_ms)) { s.trim(); return s; }
    if (!Serial.available() && !SerialUSB.available()) { delay(2); continue; }
    int c = -1;
    if (Serial.available()) c = Serial.read(); else if (SerialUSB.available()) c = SerialUSB.read();
    if (c < 0) continue;
    last_rx = millis();

    if (c == '\n' || c == '\r') {
      delay(2);
      if (Serial.available())   { int c2 = Serial.peek();   if (c2=='\n'||c2=='\r') Serial.read(); }
      else if (SerialUSB.available()) { int c2 = SerialUSB.peek(); if (c2=='\n'||c2=='\r') SerialUSB.read(); }
      s.trim(); return s;
    }
    if (c == 8 || c == 127) { if (s.length()) s.remove(s.length()-1); continue; } // backspace
    s += (char)c;
    if (s.length() > 64) { s.trim(); return s; }
  }
}

bool isValidAxis(char c){ c=toupper(c); for(int i=0; AXES[i]; ++i) if (AXES[i]==c) return true; return false; }

// I2C send with ACK report (<=28 bytes to fit AVR Wire buffer)
void sendCmd(const String& s){
  if (s.length() > 28){ printBoth("Command too long, skipped."); return; }
  Wire.beginTransmission(MEGA_ADDR);
  Wire.write(s.c_str());
  byte rc = Wire.endTransmission(); // 0=OK, 2=NACK addr, 3=NACK data, 4=other
  if (rc == 0) {
    if (VERBOSE_I2C) printBoth(String("[I2C OK] ") + s);
  } else {
    String msg = "[I2C ERR "; msg += rc; msg += "] while sending: "; msg += s;
    if (rc == 2) msg += "  (NACK on address: check SDA/SCL wiring, level shifter, GND)";
    if (rc == 3) msg += "  (NACK on data)";
    printBoth(msg);
  }
  delay(60); // pacing
}

// ---------- FAN prompt ----------
void fanInteractive(){
  printBothNoNL("Percent 0..100: ");
  String s = readLineAny();
  if (!s.length()){ printBoth("(cancelled)"); return; }
  int pct = s.toInt();
  if (pct < 0 || pct > 100){ printBoth("Out of range. Use 0..100."); return; }
  sendCmd(String("FAN,") + pct);
  printBoth(String("Fan set to ") + pct + "%");
}

// ---------- GRIP prompt ----------
void gripInteractive(){
  printBoth("Grip control:");
  printBoth("  OPEN | CLOSE | angle 0..180 | US,<500..2500> | PWR,0/1");
  printBothNoNL("> ");
  String s = readLineAny();
  if (!s.length()){ printBoth("(cancelled)"); return; }

  if (s.equalsIgnoreCase("OPEN"))  { sendCmd("GRIP_OPEN");  printBoth("Grip: OPEN");  return; }
  if (s.equalsIgnoreCase("CLOSE")) { sendCmd("GRIP_CLOSE"); printBoth("Grip: CLOSE"); return; }

  if (s.startsWith("US") || s.startsWith("us")) {
    int comma = s.indexOf(',');
    if (comma > 0) {
      int us = constrain(s.substring(comma+1).toInt(), 500, 2500);
      sendCmd(String("GRIP_US,") + us);
      printBoth(String("Grip us: ") + us);
      return;
    }
    printBoth("Usage: US,1500");
    return;
  }

  if (s.startsWith("PWR") || s.startsWith("pwr")) {
    int comma = s.indexOf(',');
    if (comma > 0) {
      int v = s.substring(comma+1).toInt();
      sendCmd(String("GRIP_PWR,") + (v ? 1 : 0));
      printBoth(String("Grip power: ") + (v ? "attach" : "detach"));
      return;
    }
    printBoth("Usage: PWR,1  (1=attach, 0=detach)");
    return;
  }

  // Angle path
  int ang = s.toInt();
  if (ang < 0 || ang > 180) { printBoth("Angle out of range (0..180)."); return; }
  sendCmd(String("GRIP,") + ang);
  printBoth(String("Grip angle: ") + ang);
}

// ---------- Guided session ----------
void runSession(){
  printBoth("\n=== SESSION STARTED ===");
  sendCmd("RUN");
  printBoth("Mega uses fixed protective ramp 1500->300 us; SPEED is ignored.");

  printBoth("Type FAN/GRIP/TEST/TEST1/WAKE anytime, or STOP to end.");
  printBothNoNL("Axis (X/Y/Z/A/B) | FAN | GRIP | TEST | TEST1 | WAKE | SLEEP | STOP: ");


  while (true){
    // Axis/command prompt
    printBothNoNL("Axis (X/Y/Z/A/B) | FAN | GRIP | TEST | TEST1 | WAKE | STOP: ");
    String ax = readLineAny();
    if (ax.equalsIgnoreCase("STOP")) break;
    if (ax.equalsIgnoreCase("FAN"))   { fanInteractive();  continue; }
    if (ax.equalsIgnoreCase("GRIP"))  { gripInteractive(); continue; }
    if (ax.equalsIgnoreCase("TEST"))  { sendCmd("TEST");   printBoth("Sent TEST");  continue; }
    if (ax.equalsIgnoreCase("TEST1")) { sendCmd("TEST1");  printBoth("Sent TEST1"); continue; }
    if (ax.equalsIgnoreCase("WAKE") || ax.equalsIgnoreCase("WAKEUP")) { sendCmd("WAKE"); printBoth("Sent WAKE"); continue; }
    if (ax.equalsIgnoreCase("SLEEP")) { sendCmd("SLEEP"); printBoth("Sent SLEEP"); continue; }


    if (ax.length()==0 || !isValidAxis(ax.charAt(0))){
      printBoth("  Invalid axis. Try X/Y/Z/A/B, or FAN/GRIP/TEST/TEST1/WAKE/STOP.");
      continue;
    }
    char axis = toupper(ax.charAt(0));

    // Angle prompt
    printBothNoNL(String("Angle in degrees [") + defaultAngleDeg + "]: ");
    String an = readLineAny();
    float angle = defaultAngleDeg;
    if (an.length()) angle = an.toFloat();
    defaultAngleDeg = angle;

    // Send move
    String mv = String(axis) + "," + String(angle, 3);
    printBoth(String("Sending move: ") + mv);
    sendCmd(mv);
    delay(300);
  }

  sendCmd("STOP");
  printBoth("=== SESSION ENDED ===\n");
}

void setup(){
  Wire.begin();              // I2C on Wire (SDA/SCL)
  Wire.setClock(100000);     // 100 kHz while debugging

  Serial.begin(115200);
  SerialUSB.begin(115200);
  unsigned long t0 = millis();
  while (!Serial && !SerialUSB && (millis() - t0 < 3000)) { delay(10); }
  if (Serial)    Serial.println("[Due] Programming port active");
  if (SerialUSB) SerialUSB.println("[Due] Native port active");

  printBoth("Due I2C tester on Wire (SDA/SCL). 115200 baud.");
  runSession(); // auto-start

  printBoth("Raw also works: X,10 / FAN,50 / GRIP,90 / TEST / TEST1 / WAKE. Type RUN to start again.");
}

void loop(){
  if (!Serial.available() && !SerialUSB.available()) return;
  String cmd = readLineAny();

  if (cmd.equalsIgnoreCase("RUN"))        runSession();
  else if (cmd.equalsIgnoreCase("FAN"))   fanInteractive();
  else if (cmd.equalsIgnoreCase("GRIP"))  gripInteractive();
  else if (cmd.equalsIgnoreCase("TEST"))  { sendCmd("TEST");   printBoth("Sent TEST"); }
  else if (cmd.equalsIgnoreCase("TEST1")) { sendCmd("TEST1");  printBoth("Sent TEST1"); }
  else if (cmd.equalsIgnoreCase("WAKE") || cmd.equalsIgnoreCase("WAKEUP")) { sendCmd("WAKE"); printBoth("Sent WAKE"); }
  else if (cmd.equalsIgnoreCase("HELP"))  printBoth("Commands: RUN, FAN, GRIP, TEST, TEST1, WAKE, STOP, or raw like X,10 / GRIP,90");
  else if (cmd.equalsIgnoreCase("STOP"))  printBoth("If a session is running, type STOP at the axis prompt.");
  else if (cmd.equalsIgnoreCase("SLEEP")) { sendCmd("SLEEP"); printBoth("Sent SLEEP"); }
  else { printBoth(String(">> ") + cmd); sendCmd(cmd); } // pass-through
}
