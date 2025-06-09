const modelOutputs = []; // will be populated dynamically

const dashboard = document.getElementById("dashboard");

// Use correct WebSocket protocol based on page protocol
const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const socket = new WebSocket(`${protocol}//${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("WebSocket connected");
});

socket.addEventListener("message", (event) => {
  try {
    const newOutput = JSON.parse(event.data);

    // Normalize threat value to lowercase for consistent checks
    if (newOutput.threat) newOutput.threat = newOutput.threat.toLowerCase();

    addModelOutput(newOutput);
  } catch (err) {
    console.error("Error parsing WebSocket message:", err);
  }
});

socket.addEventListener("close", () => {
  console.log("WebSocket connection closed");
});

socket.addEventListener("error", (err) => {
  console.error("WebSocket error:", err);
});

function renderDashboard() {
  dashboard.innerHTML = "";

  // Show latest first by reversing the array
  [...modelOutputs].reverse().forEach((output, index) => {
    const card = document.createElement("div");
    card.className = `bg-gray-900 border-l-4 ${
      output.threat === "threat" ? "border-red-600" : "border-green-600"
    } rounded-2xl p-4 shadow-md`;

    card.innerHTML = `
      <h2 class="text-white font-semibold text-lg mb-1">${output.model}</h2>
      <p><strong>Threat:</strong> <span class="${
        output.threat === "threat" ? "text-red-500" : "text-green-400"
      }">${output.threat}</span></p>
      <button class="toggle-details text-yellow-400">▶ Details</button>
      <div class="details-content hidden text-gray-300">
        <p><strong>Confidence:</strong> ${output.confidence}</p>
        <p><strong>Time:</strong> ${output.time}</p>
      </div>
    `;

    dashboard.appendChild(card);
  });

  // Toggle details
  document.querySelectorAll(".toggle-details").forEach((button) => {
    button.addEventListener("click", () => {
      const details = button.nextElementSibling;
      details.classList.toggle("hidden");
      button.textContent = details.classList.contains("hidden")
        ? "▶ Details"
        : "▼ Hide Details";
    });
  });
}

function renderChart() {
  const threatCount = modelOutputs.filter((o) => o.threat === "threat").length;
  const notThreatCount = modelOutputs.filter((o) => o.threat !== "threat").length;

  const ctx = document.getElementById("threatChart").getContext("2d");
  if (window.threatChart) window.threatChart.destroy();

  window.threatChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Threat", "Not a Threat"],
      datasets: [
        {
          label: "Threat Classification Summary",
          data: [threatCount, notThreatCount],
          backgroundColor: ["#ef4444", "#10b981"], // bright red and green
          borderRadius: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#d1d5db",
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#d1d5db" },
          grid: { color: "#374151" },
        },
        y: {
          ticks: { color: "#d1d5db" },
          grid: { color: "#374151" },
          beginAtZero: true,
          stepSize: 1,
        },
      },
    },
  });
}

function addModelOutput(newOutput) {
  modelOutputs.push(newOutput);
  renderDashboard();
  renderChart();
}
