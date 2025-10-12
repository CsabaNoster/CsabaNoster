# Tech Specs

- **MCU:** ESP32‑S3 (Xiao / TinyS3D variants tested)
- **Display:** 1.5" RGB OLED, 128×128, SSD1351; SPI wiring (≤ 7 wires)
- **Power:** Li‑ion + protection; on‑board charging; battery gauge on UI
- **Inputs:** 2–3 capacitive touch pads (film)
- **Firmware:** Arduino (Adafruit_GFX, Adafruit_SSD1351, BusIO)
- **Web:** Async web server with JSON endpoints and a single-file control panel
