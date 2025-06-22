
# tnsnames.ora Builder

## Description
A simple and elegant `tnsnames.ora` builder and formatter using HTML, JavaScript, and CSS. This tool allows users to input connection details and generates a properly formatted `tnsnames.ora` entry. It also includes a dark mode toggle for better user experience.

## Features
- Clean and responsive UI
- Real-time formatting preview
- Copy-to-clipboard functionality
- Dark mode toggle

## Getting Started
To get started, simply download the `tnsnames_builder.html` file and open it in your browser.

## Usage
1. Open the `tnsnames_builder.html` file in your browser.
2. Fill in the connection details:
   - Alias
   - Host
   - Port
   - Service Name
   - Server Type (e.g., DEDICATED)
3. Click the "Generate" button to create the `tnsnames.ora` entry.
4. Use the "Copy" button to copy the generated entry to your clipboard.

## Example
Here is an example of a generated `tnsnames.ora` entry:

ANILRAC_ANILDBRAC =
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = anildbsys.sub06221914490.basedbvcn.oraclevcn.com)(PORT = 1521))
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = ANILRAC_ANILDBRAC.sub06221914490.basedbvcn.oraclevcn.com)
    )
  )

## Dark Mode
To toggle dark mode, click the "Toggle Dark Mode" button at the top of the page. This will switch the theme between light and dark modes for better user experience.

## License
This project is licensed under the MIT License.
