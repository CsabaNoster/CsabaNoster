---
title: "ESP32 Watch 2.0"
date: "2025-10-20"
summary: "A custom ESP32-based wearable watch with display, sensors, and wireless connectivity. Includes hardware, firmware, and enclosure design."
tags: ["wearable", "esp32", "electronics", "project"]
image: "/uploads/projects/watch-2-0/1000008110.jpg"
published: true
---


⚙️ **Watch 2.0 — Dieselpunk ESP32 OLED Wristwatch**

Watch 2.0 is a handmade wristwatch built around the Seeed Studio XIAO ESP32-S3.
It drives a 1.5-inch 128×128 RGB OLED (SSD1351 driver) and runs custom-coded watch faces, including a minimalist dots face and neon face.
The board’s built-in Li-ion charging circuit handles power management directly through USB-C, and the firmware provides a Wi-Fi control panel for time sync, brightness, and OTA updates.

All code is written in C++ (Arduino) using the Adafruit GFX and Adafruit SSD1351 libraries for smooth, low-level SPI rendering and crisp visual output.

## 🧩 Hardware Components

| Category         | Component                        | Notes |
|------------------|----------------------------------|-------|
| Microcontroller  | Seeed Studio XIAO ESP32-S3       | Dual-core Xtensa LX7 @ 240 MHz, Wi-Fi + BLE, USB-C, 8 MB flash, 512 KB RAM, integrated Li-ion charging & protection |
| Display          | 1.5″ RGB OLED (SSD1351, 128×128)  | SPI interface (VCC, GND, SCK, MOSI, CS, DC, RST) |
| Power Source     | 3.7 V Li-ion or Li-poly battery   | 100–300 mAh, direct to onboard charger |
| Wiring           | 22 AWG silicone wire              | Short flexible runs for SPI and power |
| Insulation       | Kapton tape + silicone thermal pad| Prevents shorts under OLED, cushions module |
| Enclosure        | Handmade housing                  | Compact, dieselpunk look, no CNC required |

(Capacitive touch buttons planned for future revisions.)

## 💡 Display & UI

- **Driver:** SSD1351
- **Resolution:** 128 × 128 pixels
- **Color Depth:** 16-bit (65k colors)
- **Interface:** SPI (hardware SPI from XIAO ESP32-S3)
- **Libraries:** Adafruit_GFX, Adafruit_SSD1351, Adafruit_BusIO

### Current Watch Faces
- Dots face — minimalist digital dot clock
- Neon face — bright segmented digits
- Numeric face — clean everyday readable style

## 🌐 Wi-Fi Control Panel

- Built with ESPAsyncWebServer
- Hosted directly by the watch — no external app needed

**Features:**
- Time sync from phone
- Brightness control
- Watch face selection
- Battery status
- OTA (Over-the-Air) firmware updates
- Single-file HTML interface served from PROGMEM

## 🔌 Wiring Pinout (example)

| OLED Pin | XIAO ESP32-S3 Pin | Function        |
|----------|-------------------|-----------------|
| VCC      | 3V3               | Power           |
| GND      | GND               | Ground          |
| SCK      | D8 / GPIO10       | SPI Clock       |
| MOSI     | D9 / GPIO11       | SPI Data        |
| CS       | D7 / GPIO9        | Chip Select     |
| DC       | D6 / GPIO8        | Data/Command    |
| RST      | D5 / GPIO7        | Reset           |

(Touch pad pins reserved for future revision.)

## ⚙️ Firmware Environment

| Tool           | Version / Details |
|----------------|------------------|
| Arduino IDE    | v2.x             |
| ESP32 Core     | 3.3.x            |
| Language       | C++ (Arduino)    |
| Libraries      | Adafruit_GFX, Adafruit_SSD1351, Adafruit_BusIO, Wire, SPI, ESPAsyncWebServer |
| OTA Updates    | via Web UI       |
| Storage        | 8 MB Flash (PROGMEM stores UI and bitmap data) |

## 🪛 Assembly Notes

- Apply Kapton tape under the OLED and around battery wires to avoid shorts.
- Place a thin silicone pad behind the display to prevent pressure lines.
- Keep SPI wires under 5 cm for signal integrity.
- Adjust setRotation() and measure text bounding boxes for perfect centering.
- Use a single definition of global variables in state.cpp; extern in headers only.

## 📦 Bill of Materials Summary

| Item                        | Quantity | Notes |
|-----------------------------|----------|-------|
| Seeed Studio XIAO ESP32-S3  | 1        | Onboard Li-ion charger, USB-C |
| 1.5″ RGB OLED (SSD1351)     | 1        | SPI display, 128×128 pixels |
| 3.7 V Li-ion battery        | 1        | 100–300 mAh, direct to VBAT |
| 22 AWG silicone wire        | ~30 cm   | Flexible, short connections |
| Kapton tape                 | 1 roll   | Insulation for OLED and battery |
| Silicone thermal pad        | 1 small  | Cushions display back |
| Handmade enclosure          | 1        | Custom layout, no CNC machining |
