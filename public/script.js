const modelOutputs = [];

const dashboard = document.getElementById("dashboard");

function renderDashboard() {
  dashboard.innerHTML = "";

  [...modelOutputs].reverse().forEach((output) => {
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

  document.querySelectorAll(".toggle-details").forEach(button => {
    button.addEventListener("click", () => {
      const details = button.nextElementSibling;
      details.classList.toggle("hidden");
      button.textContent = details.classList.contains("hidden") ? "▶ Details" : "▼ Hide Details";
    });
  });
}

function renderChart() {
  const threatCount = modelOutputs.filter(o => o.threat === "threat").length;
  const notThreatCount = modelOutputs.filter(o => o.threat !== "threat").length;

  const ctx = document.getElementById("threatChart").getContext("2d");
  if (window.threatChart) window.threatChart.destroy();

  window.threatChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Threat", "Not a Threat"],
      datasets: [{
        label: "Threat Classification Summary",
        data: [threatCount, notThreatCount],
        backgroundColor: ["#f87171", "#34d399"],
        borderRadius: 10,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 500,
        easing: 'easeOutCubic'
      },
      plugins: {
        legend: {
          labels: {
            color: "#d1d5db"
          }
        }
      },
      scales: {
        x: {
          ticks: { color: "#d1d5db" },
          grid: { color: "#374151" }
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#d1d5db" },
          grid: { color: "#374151" }
        }
      }
    }
  });
}

function addModelOutput(newOutput) {
  modelOutputs.push(newOutput);
  renderDashboard();
  renderChart();
}

// WebSocket Client
const socket = new WebSocket(`ws://${window.location.host}`);

socket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  addModelOutput(data);
};
