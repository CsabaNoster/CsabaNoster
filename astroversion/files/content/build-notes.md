# Build Notes & Pitfalls

- **Fonts & orientation:** fix `setRotation()`, measure text boxes, and center with computed widths/heights.
- **Display artifacts:** avoid hard pressure on OLED back; use Kapton/thermal pads to prevent shorts/lines.
- **Layout flexibility:** parameterize offsets so you can move battery, date, and seconds freely; UK time via proper TZ handling.
