# OraCanvas Help & Usage Guide

This document explains the purpose and function of each part of the OraCanvas app.

[View this help as a modern web page](HelpFile.html)

## Main Components

### 1. Header
- Displays the app title.
- Includes quick links to Help and ReadMe.

### 2. Tabs
- Three tabs: TNSNAMES.ORA, SQLNET.ORA, LISTENER.ORA.
- Clicking a tab switches the visible editor and controls.

### 3. Editor Area (per tab)
- **Textarea**: Where you paste, edit, or view your Oracle config file.
- **Load Sample**: Loads a set of sample configurations (Simple, Intermediate, Complex, Very Complex) for the selected file type.
- **Clear**: Clears the editor after confirmation.
- **Download**: Validates and downloads the current content as the appropriate file. Alerts if the content is empty or invalid.
- **Validate**: Checks if your config matches the sample exactly. Green orb = valid, red orb = invalid (auto-resets to sample).

### 4. Footer
- Displays copyright and author.

### 5. Validation
- Strict validation: only exact matches to the sample are valid.
- Alerts are shown if the content is empty or does not match the expected format.

## Accessibility & Responsiveness
- The app is keyboard accessible and works well on mobile devices.
- ARIA labels and semantic HTML are used for better accessibility.

## Tips
- Use the sample loader to quickly see valid Oracle config formats.
- Always validate your config before downloading.

---
For more information, see the main [README.md](README.md) or [README.html](README.html).
