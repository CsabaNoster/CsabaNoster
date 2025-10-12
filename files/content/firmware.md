# Firmware Notes

Key libraries: `Adafruit_GFX`, `Adafruit_SSD1351`, `Adafruit_BusIO`, and `Wire`. Ensure ESP32 core 3.3.x is installed in the Arduino IDE.

- If numbers are mirrored or clipped, verify rotation (`setRotation()`) and font baseline; increase bounding boxes.
- Avoid redefinitions; keep globals in a single TU and `extern` them in headers.
- Remove or define missing symbols (e.g., `NEON_PINK`, `NEON_TOP_Y`, `NEON_GAP_Y`).

**Time sync endpoint:** `/api/set?phonesync=1&epoch_ms=...` sets device time when `epoch_ms` is valid.
