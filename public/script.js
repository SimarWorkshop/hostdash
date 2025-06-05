const dashboard = document.getElementById("dashboard");

// Setup WebSocket with secure fallback
const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
const socket = new WebSocket(`${protocol}://${location.host}`);

socket.onmessage = (event) => {
  const output = JSON.parse(event.data);

  const card = document.createElement("div");
  card.className = "bg-gray-800 rounded-2xl p-4 shadow-md mb-4";

  card.innerHTML = `
    <h2 class="text-white font-semibold text-lg mb-1">${output.model}</h2>
    <p class="text-white"><strong>Threat:</strong> ${output.threat}</p>
    
    <button class="toggle-details">▶ Details</button>
    <div class="details-content hidden">
      <p><strong>Confidence:</strong> ${output.confidence}</p>
      <p><strong>Time:</strong> ${output.time}</p>
    </div>
  `;

  dashboard.prepend(card);

  // Add toggle functionality for this new card
  const toggleBtn = card.querySelector(".toggle-details");
  const detailsDiv = card.querySelector(".details-content");
  toggleBtn.addEventListener("click", () => {
    detailsDiv.classList.toggle("hidden");
    toggleBtn.textContent = detailsDiv.classList.contains("hidden") ? "▶ Details" : "▼ Hide Details";
  });
};

// Sample static data to initialize dashboard
const modelOutputs = [
  {
    model: "Intrusion Detection",
    threat: "Malware Signature Detected",
    confidence: "97%",
    time: "2025-06-05 12:00:00"
  },
  {
    model: "Behavioral Analysis",
    threat: "Suspicious Login",
    confidence: "88%",
    time: "2025-06-05 12:05:00"
  },
  {
    model: "Intrusion Detection",
    threat: "Brute Force Attempt",
    confidence: "92%",
    time: "2025-06-05 12:10:00"
  },
  {
    model: "Anomaly Detection",
    threat: "Unusual Traffic Spike",
    confidence: "85%",
    time: "2025-06-05 12:15:00"
  }
];

// Populate initial static cards
modelOutputs.forEach(output => {
  const card = document.createElement("div");
  card.className = "bg-gray-800 rounded-2xl p-4 shadow-md mb-4";

  card.innerHTML = `
    <h2 class="text-white font-semibold text-lg mb-1">${output.model}</h2>
    <p class="text-white"><strong>Threat:</strong> ${output.threat}</p>
    
    <button class="toggle-details">▶ Details</button>
    <div class="details-content hidden">
      <p><strong>Confidence:</strong> ${output.confidence}</p>
      <p><strong>Time:</strong> ${output.time}</p>
    </div>
  `;

  dashboard.appendChild(card);

  // Toggle logic for static cards
  const toggleBtn = card.querySelector(".toggle-details");
  const detailsDiv = card.querySelector(".details-content");
  toggleBtn.addEventListener("click", () => {
    detailsDiv.classList.toggle("hidden");
    toggleBtn.textContent = detailsDiv.classList.contains("hidden") ? "▶ Details" : "▼ Hide Details";
  });
});

// Prepare data for chart
const modelCounts = {};
modelOutputs.forEach(output => {
  modelCounts[output.model] = (modelCounts[output.model] || 0) + 1;
});

const ctx = document.getElementById("threatChart").getContext("2d");

new Chart(ctx, {
  type: "bar",
  data: {
    labels: Object.keys(modelCounts),
    datasets: [{
      label: "Threats Detected",
      data: Object.values(modelCounts),
      backgroundColor: ["#ef4444", "#10b981", "#3b82f6", "#f59e0b"],
      borderRadius: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        labels: {
          color: "white"
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "white"
        },
        grid: {
          color: "#374151"
        }
      },
      y: {
        ticks: {
          color: "white"
        },
        grid: {
          color: "#374151"
        }
      }
    }
  }
});
