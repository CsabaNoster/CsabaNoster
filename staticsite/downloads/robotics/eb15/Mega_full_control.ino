// ====== CONFIG: PICK YOUR DISPLAY DRIVER ======
// Set ONE of these to 1 and the other to 0
#define USE_SH1106 1      // 1 for AZDelivery 1.3" SH1106
#define USE_SSD1306 0     // 1 for 0.96" SSD1306

// ====== PINS & INCLUDES ======
#include <Wire.h>
#include <WiFi.h>
#include "time.h"
#include <Preferences.h>

#include <Adafruit_GFX.h>
#if USE_SH1106
  #include <Adafruit_SH110X.h>
#elif USE_SSD1306
  #include <Adafruit_SSD1306.h>
#else
  #error "Select a display driver above."
#endif

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define SDA_PIN 8
#define SCL_PIN 9
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_ADDR 0x3C

#if USE_SH1106
  Adafruit_SH1106G display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
#else
  Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
#endif

// ====== WIFI / NTP ======
const char* ssid     = "VodafoneEAFBFD";
const char* password = "MRd4pnJChhZJt2XN";
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 0;      // e.g. 3600 for UTC+1
const int   daylightOffset_sec = 0; // e.g. 3600 during DST

// ====== BLE (custom simple service) ======
#define SVC_UUID       "b0a7d0e0-6a9d-4c64-b1a9-6f0d61f9face"
#define FACE_UUID      "b0a7d0e1-6a9d-4c64-b1a9-6f0d61f9face" // write 0..3
BLECharacteristic *faceChar;

// ====== FACE STATE (persisted) ======
Preferences prefs;
int faceIndex = 0;        // 0..3
const int FACE_MIN = 0;
const int FACE_MAX = 3;

// ====== DRAW HELPERS ======
void drawTopBarPlaceholder() {
  display.setTextSize(1);
  display.setCursor(0,0);
#if USE_SH1106
  display.setTextColor(SH110X_WHITE);
#else
  display.setTextColor(WHITE);
#endif
  display.print("BAT: ??%");
}

// Face 0: Big HH:MM, small seconds lower-right
void drawFace0(const tm &t) {
  drawTopBarPlaceholder();
  display.setTextSize(3);
  display.setCursor(10, 20);
  display.printf("%02d:%02d", t.tm_hour, t.tm_min);
  display.setTextSize(2);
  display.setCursor(98, 46);
  display.printf("%02d", t.tm_sec);
}

// Face 1: Minimal center time (HH:MM) only
void drawFace1(const tm &t) {
  drawTopBarPlaceholder();
  display.setTextSize(4);
  display.setCursor(6, 24);
  display.printf("%02d:%02d", t.tm_hour, t.tm_min);
}

// Face 2: Inverted strip + date line
void drawFace2(const tm &t) {
  display.fillRect(0, 0, SCREEN_WIDTH, 16, 1);
#if USE_SH1106
  display.setTextColor(SH110X_BLACK);
#else
  display.setTextColor(BLACK);
#endif
  display.setTextSize(1);
  display.setCursor(2, 3);
  display.print("BAT: ??%");

#if USE_SH1106
  display.setTextColor(SH110X_WHITE);
#else
  display.setTextColor(WHITE);
#endif
  display.setTextSize(3);
  display.setCursor(10, 22);
  display.printf("%02d:%02d", t.tm_hour, t.tm_min);

  display.setTextSize(1);
  display.setCursor(10, 54);
  display.printf("%04d-%02d-%02d", 1900 + t.tm_year, t.tm_mon + 1, t.tm_mday);
}

// Face 3: Seconds bar + big time
void drawFace3(const tm &t) {
  drawTopBarPlaceholder();
  int barW = map(t.tm_sec, 0, 59, 0, SCREEN_WIDTH);
  display.fillRect(0, 14, barW, 2, 1);
  display.setTextSize(3);
  display.setCursor(10, 24);
  display.printf("%02d:%02d", t.tm_hour, t.tm_min);
}

// ====== BLE CALLBACK ======
class FaceCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *c) override {
    // On your setup BLECharacteristic::getValue() returns Arduino String
    String v = c->getValue();
    if (!v.length()) return;

    int val = -1;
    if (v.length() == 1) {
      // single byte or single ASCII digit
      uint8_t b = (uint8_t)v[0];
      if (b <= 3)       val = b;          // raw byte 0..3
      else if (b>='0' && b<='3') val = b - '0'; // ASCII '0'..'3'
    } else {
      val = v.toInt(); // handles "0", "1", "2", "3" as strings
    }

    if (val >= FACE_MIN && val <= FACE_MAX) {
      faceIndex = val;
      prefs.putInt("face", faceIndex);
      uint8_t echo = (uint8_t)faceIndex;
      faceChar->setValue(&echo, 1);
      faceChar->notify();
    }
  }
};

void setup() {
  Serial.begin(115200);

  // Display init
  Wire.begin(SDA_PIN, SCL_PIN);
  Wire.setClock(400000);
#if USE_SH1106
  if (!display.begin(OLED_ADDR, true)) { Serial.println("SH1106 init failed"); for(;;); }
#else
  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) { Serial.println("SSD1306 init failed"); for(;;); }
#endif
  display.clearDisplay(); display.display();

  // Load persisted face
  prefs.begin("watch", false);
  faceIndex = prefs.getInt("face", 0);
  if (faceIndex < FACE_MIN || faceIndex > FACE_MAX) faceIndex = 0;

  // WiFi + NTP
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password); // <-- fixed name
  uint32_t t0 = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - t0 < 15000) { delay(250); }
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  // BLE
  BLEDevice::init("ESP32-S3 Watch");
  BLEServer *srv = BLEDevice::createServer();
  BLEService *svc = srv->createService(SVC_UUID);

  faceChar = svc->createCharacteristic(
    FACE_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_WRITE |
    BLECharacteristic::PROPERTY_NOTIFY
  );
  faceChar->addDescriptor(new BLE2902());
  faceChar->setCallbacks(new FaceCallbacks());
  uint8_t b = (uint8_t)faceIndex;
  faceChar->setValue(&b, 1);

  svc->start();
  BLEAdvertising *adv = srv->getAdvertising();
  adv->addServiceUUID(SVC_UUID);
  adv->start();

#if USE_SH1106
  display.setTextColor(SH110X_WHITE);
#else
  display.setTextColor(WHITE);
#endif
  display.setTextSize(1);
  display.setCursor(0,0);
  display.println("BLE Ready  Faces:0..3");
  display.display();
  delay(800);
}

void loop() {
  struct tm t;
  if (getLocalTime(&t)) {
    display.clearDisplay();
    switch (faceIndex) {
      case 0: drawFace0(t); break;
      case 1: drawFace1(t); break;
      case 2: drawFace2(t); break;
      case 3: drawFace3(t); break;
      default: drawFace0(t); break;
    }
    display.display();
  }
  delay(200);
}
