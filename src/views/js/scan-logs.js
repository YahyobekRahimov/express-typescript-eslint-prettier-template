// Scan Logs Page JavaScript

document.addEventListener("DOMContentLoaded", loadScanLogs);

// Load scan logs from API
async function loadScanLogs() {
  try {
    const response = await fetch("/api/scan-logs");
    const data = await response.json();

    if (data.success) {
      displayScanLogs(data.data);
    } else {
      showError("Failed to load scan logs");
    }
  } catch (error) {
    console.error("Error loading scan logs:", error);
    showError("Error loading scan logs");
  }
}

// Display scan logs
function displayScanLogs(logs) {
  const tbody = document.getElementById("logsTableBody");
  const noLogs = document.getElementById("noLogs");
  const table = document.getElementById("logsTable");

  tbody.innerHTML = "";

  if (logs.length === 0) {
    table.style.display = "none";
    noLogs.style.display = "block";
    return;
  }

  table.style.display = "table";
  noLogs.style.display = "none";

  logs.forEach((log) => {
    const row = createLogRow(log);
    tbody.appendChild(row);
  });
}

// Create log row
function createLogRow(log) {
  const row = document.createElement("tr");

  // Format timestamp
  const timestamp = new Date(log.created_at || new Date()).toLocaleString();
  const scanType = log.type || "badge";

  row.innerHTML = `
    <td class="timestamp">${timestamp}</td>
    <td class="delegate-name">${log.delegate_name || "Unknown"}</td>
    <td class="startup-name">${log.startup_name || "N/A"}</td>
    <td class="scanner-name">${log.scanned_by || "System"}</td>
    <td>
      <span class="scan-type type-${scanType}">${scanType}</span>
    </td>
  `;

  return row;
}

// Search logs
document.getElementById("searchInput")?.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const rows = document.querySelectorAll("#logsTableBody tr");

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? "" : "none";
  });
});

// Filter by type
document.getElementById("filterType")?.addEventListener("change", (e) => {
  const filterValue = e.target.value.toLowerCase();
  const rows = document.querySelectorAll("#logsTableBody tr");

  rows.forEach((row) => {
    if (!filterValue) {
      row.style.display = "";
    } else {
      const typeCell = row.querySelector(".scan-type");
      const isVisible =
        typeCell && typeCell.textContent.toLowerCase().includes(filterValue);
      row.style.display = isVisible ? "" : "none";
    }
  });
});

// Utility functions
function showError(message) {
  alert(`Error: ${message}`);
}
