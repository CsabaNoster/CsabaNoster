---
title: Robotic Arm Control Box
summary: Electronics and power system for a 5‑axis robotic arm using an Arduino Due (master) with an Arduino Mega + RAMPS 1.4 (drivers).
date: '2025-10-09'
published: true
tags: [robotics, controls]
stack: [Arduino, Wiring]
image: /uploads/robotics/arduino-control-box/Box.png
---

This control box houses the electronics and power system for a 5‑axis robotic arm. It uses an Arduino Due as the main controller and an Arduino Mega with a RAMPS 1.4 shield to drive five stepper motors and one servo for the gripper.

## System Overview

- Arduino Due — handles motion control and sends commands
- Arduino Mega + RAMPS 1.4 — drives the stepper motors and servo
- I2C connection between the two, using a bidirectional level shifter for 3.3 V ↔ 5 V logic
- 12 V power supply for the motors and drivers
- Single main power switch controls the entire system

## Main Components

- Arduino Due (master)
- Arduino Mega 2560 (slave) + RAMPS 1.4
- I2C level shifter (BSS138 type)
- 12 V DC PSU
- 5× stepper drivers (A4988)
- SG90 servo for the gripper
