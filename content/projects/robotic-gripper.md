---
title: Robotic Gripper Prototype
summary: First pass at a 3D‑printed, servo‑driven gripper with limit sensing and interchangeable fingertips.
date: 2025-10-09
published: true
tags: [robotics, mechatronics, controls]
stack: [ESP32-S3, PlatformIO, Arduino, CAD]
---
I designed and printed a compact two‑finger gripper for small part handling. The current prototype uses a micro servo with a horn‑to‑linkage drive, bronze bushings on the finger pivots, and TPU pads for grip.

Highlights:
- Simple linkage for quick iterations; no gears yet
- Optional hall sensor for end‑stop detection
- Removable fingertips: TPU, PLA, and felt‑lined variants
- Control: PWM via ESP32‑S3 with basic position mapping

Next steps:
- Add current/torque limiting to protect the servo
- Try a worm‑gear ratio for stronger holding force
- Design a slip clutch or magnetic coupler to reduce shock loads
