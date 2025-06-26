# Oracle RAC IP Generator

A modern, user-friendly web utility for Oracle DBAs to rapidly prototype Oracle RAC network configurations. This tool allows you to generate hostnames and IPs for Oracle RAC clusters, including SCAN IPs, with export and copy features.

---

## Features
- **Deployment Type**: Choose between Normal Hosts (physical/virtual) or Kubernetes-based deployment.
- **Node Count**: Set the number of RAC nodes (2–100 for normal hosts, 2–5000 for Kubernetes).
- **Oracle Version**: Select the Oracle Database version (23ai, 19c, 19.16+, 21c).
- **Network Settings**:
  - **Hostname Prefix**: Prefix for each node's hostname (e.g., racnode1, racnode2).
  - **Public Subnet Base IP**: Starting IP for the public network (auto-incremented per node).
  - **Private Subnet Base IP**: Starting IP for the private interconnect (auto-incremented per node).
  - **VIP Subnet Base IP**: Starting IP for the Virtual IPs (auto-incremented per node).
  - **SCAN Subnet Base IP**: Starting IP for SCAN addresses (auto-incremented for each SCAN IP).
  - **Number of SCAN IPs**: Fixed at 3 (industry standard for production RAC).
- **Generate**: Click to generate the RAC node and SCAN IP table.
- **Copy/Export**: Copy the table or export as CSV, JSON, or YAML. You can set a custom file prefix for exports.

---

## UI/UX Highlights
- Modern, responsive design with Montserrat font, red/blue color theme, and tooltips for all fields.
- Table columns include Node, Hostname, Public IP, Private IP, VIP, and SCAN IPs (all in one table for clarity).
- Export/copy buttons are icon-based for a clean look, with helper text explaining their purpose.
- All user input is validated; invalid IPs revert to defaults.
- The SCAN IP count is fixed for simplicity and best practice.

---

## How to Use
1. Fill in the form fields as needed (deployment type, node count, Oracle version, network settings).
2. Click **Generate** to see the table of hostnames and IPs.
3. Use the icon buttons to copy or export the table in your preferred format.
4. Set a custom file prefix for exports if desired.

---

## Credits & License

**Copyright © Anil Mahadev**

Anyone wishing to use this tool or its code must give due credit to the owner. Please retain this notice in all copies or substantial portions of the software.
