
# tnsnames.ora Builder - Help Guide

## Overview
The **tnsnames.ora Builder** is a simple and elegant tool designed to help you generate and format `tnsnames.ora` entries. This tool features a clean and responsive UI, real-time formatting preview, and copy-to-clipboard functionality. It also includes a dark mode for a comfortable user experience in low-light environments.

## Usage Instructions
1. **Open the HTML File**: Open the `tnsnames_builder.html` file in any modern web browser.
2. **Fill in the Fields**:
   - **Alias**: Enter the alias name for the connection (e.g., `ORCL`).
   - **Host**: Enter the hostname or IP address of the database server (e.g., `myhost.example.com`).
   - **Port**: Enter the port number (e.g., `1521`).
   - **Service Name**: Enter the full service name (e.g., `orclpdb1`).
   - **Server**: Enter the server type (e.g., `DEDICATED`).
3. **Generate Entry**: Click the **Generate** button to create the `tnsnames.ora` entry.
4. **Copy Entry**: Click the **Copy** button to copy the generated entry to your clipboard.
5. **Download Entry**: Click the **Download** button to save the generated entry as a `.ora` file.

## Features
- **Real-time Formatting Preview**: See the generated `tnsnames.ora` entry as you fill in the fields.
- **Copy to Clipboard**: Easily copy the generated entry with a single click.
- **Download as File**: Save the generated entry as a `.ora` file.
- **Dark Mode**: Toggle between light and dark modes for a comfortable user experience.

## Dark Mode
To switch between light and dark modes, click the **Toggle Dark Mode** button at the top of the page. The tool will remember your preference and apply it the next time you open the file.

## Notes
- Ensure all fields are filled in before generating the entry.
- The tool supports multiple entries by generating and copying/downloading each entry separately.
- The generated entries are formatted to match the standard `tnsnames.ora` structure.

## Example Entry

FREE =
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = FREE)
    )
  )
