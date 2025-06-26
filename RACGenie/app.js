// Oracle RAC IP Generator - App Logic

document.addEventListener('DOMContentLoaded', function() {
    const deploymentType = document.getElementById('deploymentType');
    const nodeCount = document.getElementById('nodeCount');
    const nodeLimitInfo = document.getElementById('nodeLimitInfo');
    const oracleVersion = document.getElementById('oracleVersion');
    const versionInfo = document.getElementById('versionInfo');
    const racForm = document.getElementById('racForm');
    const output = document.getElementById('output');

    function updateNodeLimits() {
        if (deploymentType.value === 'normal') {
            nodeCount.max = 100;
            nodeLimitInfo.textContent = '2–100 nodes supported for normal hosts.';
            if (parseInt(nodeCount.value) > 100) nodeCount.value = 100;
        } else {
            nodeCount.max = 5000;
            nodeLimitInfo.textContent = '2–5000 nodes supported for Kubernetes.';
            if (parseInt(nodeCount.value) > 5000) nodeCount.value = 5000;
        }
    }

    function updateVersionInfo() {
        if (oracleVersion.value === '19c') {
            versionInfo.textContent = 'Recommended for production (Long Term Support).';
        } else if (oracleVersion.value === '19.16') {
            versionInfo.textContent = '19.16+ required for Kubernetes deployments.';
        } else if (oracleVersion.value === '21c') {
            versionInfo.textContent = '21c is for testing only, not recommended for production.';
        } else {
            versionInfo.textContent = '';
        }
    }

    deploymentType.addEventListener('change', function() {
        updateNodeLimits();
        // Auto-select 19.16+ for k8s
        if (deploymentType.value === 'k8s') {
            oracleVersion.value = '19.16';
        } else {
            oracleVersion.value = '19c';
        }
        updateVersionInfo();
    });

    oracleVersion.addEventListener('change', updateVersionInfo);
    nodeCount.addEventListener('input', updateNodeLimits);

    updateNodeLimits();
    updateVersionInfo();

    racForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Collect user input
        const nodes = parseInt(nodeCount.value);
        const hostnamePrefix = document.getElementById('hostnamePrefix').value.trim();
        const publicBaseIpInput = document.getElementById('publicBaseIp');
        const privateBaseIpInput = document.getElementById('privateBaseIp');
        const vipBaseIpInput = document.getElementById('vipBaseIp');
        const scanBaseIpInput = document.getElementById('scanBaseIp');
        const scanCount = parseInt(document.getElementById('scanCount').value);

        // Default samples
        const defaults = {
            publicBaseIp: '192.168.1.10',
            privateBaseIp: '10.0.0.10',
            vipBaseIp: '192.168.1.110',
            scanBaseIp: '192.168.1.200'
        };

        // IP validation helper
        function isValidIp(ip) {
            const parts = ip.split('.').map(Number);
            if (parts.length !== 4 || parts.some(n => isNaN(n) || n < 0 || n > 255)) return false;
            if (ip === '0.0.0.0' || ip === '255.255.255.255') return false;
            if (parts[0] === 127 || parts[0] >= 224) return false; // loopback or multicast/broadcast
            return true;
        }
        function restoreIfInvalid(input, def) {
            if (!isValidIp(input.value.trim())) {
                input.value = def;
                return def;
            }
            return input.value.trim();
        }
        // Validate and restore if needed
        const publicBaseIp = restoreIfInvalid(publicBaseIpInput, defaults.publicBaseIp);
        const privateBaseIp = restoreIfInvalid(privateBaseIpInput, defaults.privateBaseIp);
        const vipBaseIp = restoreIfInvalid(vipBaseIpInput, defaults.vipBaseIp);
        const scanBaseIp = restoreIfInvalid(scanBaseIpInput, defaults.scanBaseIp);

        // Helper to increment IPs
        function ipInc(ip, inc) {
            let parts = ip.split('.').map(Number);
            parts[3] += inc;
            for (let i = 3; i > 0; i--) {
                if (parts[i] > 254) {
                    parts[i] = 1;
                    parts[i-1]++;
                }
            }
            return parts.join('.');
        }

        // Generate node data
        let tableRows = '';
        let tableArr = [];
        for (let i = 0; i < nodes; i++) {
            const hostname = `${hostnamePrefix}${i+1}`;
            const publicIp = ipInc(publicBaseIp, i);
            const privateIp = ipInc(privateBaseIp, i);
            const vipIp = ipInc(vipBaseIp, i);
            tableRows += `<tr><td>${i+1}</td><td>${hostname}</td><td>${publicIp}</td><td>${privateIp}</td><td>${vipIp}</td></tr>`;
            tableArr.push([i+1, hostname, publicIp, privateIp, vipIp]);
        }
        // Generate SCAN IPs (increment last octet by 1 for each)
        let scanIps = [];
        let scanBaseParts = scanBaseIp.split('.').map(Number);
        for (let i = 0; i < scanCount; i++) {
            let ipParts = scanBaseParts.slice();
            ipParts[3] += i;
            for (let j = 3; j > 0; j--) {
                if (ipParts[j] > 254) {
                    ipParts[j] = 1;
                    ipParts[j-1]++;
                }
            }
            scanIps.push(ipParts.join('.'));
        }

        // Table text for copy/export (tab-separated)
        const scanIpHeader = scanIps.map((_, i) => `SCAN IP${i+1}`);
        const tableText = [
            ['Node', 'Hostname', 'Public IP', 'Private IP', 'VIP', ...scanIpHeader],
            ...tableArr.map((row, idx) => {
                if (typeof row[0] === 'number') {
                    // Node rows: add SCAN IPs only to first node row, rest empty
                    return [...row, ...scanIps.map((ip, i) => idx === 0 ? ip : '')];
                } else {
                    // Not used, but for safety
                    return [...row, ...scanIps];
                }
            })
        ].map(row => row.join('\t')).join('\n');
        // Table CSV for export
        const tableCsv = [
            ['Node', 'Hostname', 'Public IP', 'Private IP', 'VIP', ...scanIpHeader],
            ...tableArr.map((row, idx) => {
                if (typeof row[0] === 'number') {
                    return [...row, ...scanIps.map((ip, i) => idx === 0 ? ip : '')];
                } else {
                    return [...row, ...scanIps];
                }
            })
        ].map(row => row.join(',')).join('\n');
        // Table JSON for export
        const tableJson = JSON.stringify(
            Array.from({length: nodes}, (_, i) => ({
                node: i+1,
                hostname: `${hostnamePrefix}${i+1}`,
                public_ip: ipInc(publicBaseIp, i),
                private_ip: ipInc(privateBaseIp, i),
                vip: ipInc(vipBaseIp, i),
                scan_ips: scanIps
            })), null, 2);
        // Table YAML for export
        function toYAML(arr) {
            return arr.map(obj => {
                let lines = Object.entries(obj).map(([k, v]) => {
                    if (Array.isArray(v)) {
                        return `${k}:\n  - ${v.join('\n  - ')}`;
                    } else {
                        return `${k}: ${v}`;
                    }
                });
                return '- ' + lines.join('\n  ');
            }).join('\n');
        }
        const tableYaml = toYAML(
            Array.from({length: nodes}, (_, i) => ({
                node: i+1,
                hostname: `${hostnamePrefix}${i+1}`,
                public_ip: ipInc(publicBaseIp, i),
                private_ip: ipInc(privateBaseIp, i),
                vip: ipInc(vipBaseIp, i),
                scan_ips: scanIps
            }))
        );
        // Table HTML with single set of export/copy buttons and filename input
        let tableRowsHtml = '';
        const scanIpHeaderHtml = scanIps.map((_, i) => `<th>SCAN IP${i+1}</th>`).join('');
        for (let i = 0; i < nodes; i++) {
            const hostname = `${hostnamePrefix}${i+1}`;
            const publicIp = ipInc(publicBaseIp, i);
            const privateIp = ipInc(privateBaseIp, i);
            const vipIp = ipInc(vipBaseIp, i);
            let scanCells = '';
            if (i === 0) {
                scanCells = scanIps.map(ip => `<td>${ip}</td>`).join('');
            } else {
                scanCells = scanIps.map(() => `<td></td>`).join('');
            }
            tableRowsHtml += `<tr><td>${i+1}</td><td>${hostname}</td><td>${publicIp}</td><td>${privateIp}</td><td>${vipIp}</td>${scanCells}</tr>`;
        }
        const exportBtnsHtml = `
        <div style='margin-bottom:10px;'>
            <label style="font-weight:500; margin-right:4px;">Export File Prefix:
                <span class="tooltip" title="Prefix for exported files, e.g., 'racIP'.">🛈</span>
            </label>
            <input id='exportFilePrefix' type='text' placeholder='Export file prefix' style='padding:6px 10px;border-radius:4px;border:1px solid #bbb;font-size:1em;width:180px;margin-right:10px;'>
            <span class="info" style="font-size:0.98em; color:#666; margin-right:10px;">Use the buttons to copy or download the table as CSV, JSON, or YAML.</span>
            <button id='copyTableBtn' style='margin-right:8px;' title="Copy the table to clipboard">📋 Copy</button>
            <button id='exportTableCsvBtn' style='margin-right:8px;' title="Download as CSV">📄 CSV</button>
            <button id='exportTableJsonBtn' style='margin-right:8px;' title="Download as JSON">🟦 JSON</button>
            <button id='exportTableYamlBtn' title="Download as YAML">🟨 YAML</button>
        </div>`;
        const tableHtml = `
        <h2>RAC Node IP Table</h2>
        ${exportBtnsHtml}
        <div class="table-responsive">
        <table class="rac-table">
            <thead><tr><th>Node</th><th>Hostname</th><th>Public IP</th><th>Private IP</th><th>VIP</th>${scanIpHeaderHtml}</tr></thead>
            <tbody>${tableRowsHtml}</tbody>
        </table>
        </div>
        `;

        output.innerHTML = tableHtml;
        // Copy/Export button logic
        function getExportPrefix() {
            const prefixInput = document.getElementById('exportFilePrefix');
            let prefix = prefixInput && prefixInput.value.trim() ? prefixInput.value.trim() : 'racIP';
            return prefix;
        }
        // Helper for prompting filename
        function promptForFilename(defaultName) {
            let name = prompt('Enter file name to save:', defaultName);
            if (name === null) return null; // User hit cancel
            if (!name.trim()) return null; // User entered empty
            return name.trim();
        }
        // Copy button logic
        const copyBtn = document.getElementById('copyTableBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function(ev) {
                ev.preventDefault();
                navigator.clipboard.writeText(tableText)
                    .then(() => {
                        copyBtn.textContent = 'Copied!';
                        setTimeout(() => copyBtn.textContent = 'Copy', 1200);
                    })
                    .catch(() => {
                        copyBtn.textContent = 'Copy failed';
                        setTimeout(() => copyBtn.textContent = 'Copy', 1200);
                    });
            });
        }
        // Export Table CSV
        const exportCsvBtn = document.getElementById('exportTableCsvBtn');
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', function(ev) {
                ev.preventDefault();
                const blob = new Blob([tableCsv], {type: 'text/csv'});
                const url = URL.createObjectURL(blob);
                const defaultName = `${getExportPrefix()}RACIP.csv`;
                const fileName = promptForFilename(defaultName);
                if (!fileName) return; // Abort export if cancelled or empty
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
            });
        }
        // Export Table JSON
        const exportJsonBtn = document.getElementById('exportTableJsonBtn');
        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', function(ev) {
                ev.preventDefault();
                const blob = new Blob([tableJson], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const defaultName = `${getExportPrefix()}RACIP.json`;
                const fileName = promptForFilename(defaultName);
                if (!fileName) return; // Abort export if cancelled or empty
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
            });
        }
        // Export Table YAML
        const exportYamlBtn = document.getElementById('exportTableYamlBtn');
        if (exportYamlBtn) {
            exportYamlBtn.addEventListener('click', function(ev) {
                ev.preventDefault();
                const blob = new Blob([tableYaml], {type: 'text/yaml'});
                const url = URL.createObjectURL(blob);
                const defaultName = `${getExportPrefix()}RACIP.yaml`;
                const fileName = promptForFilename(defaultName);
                if (!fileName) return; // Abort export if cancelled or empty
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
            });
        }
    });
});
