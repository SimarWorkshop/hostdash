const express = require("express");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Create HTTP server
const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

// Create WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

// Store all connected clients
let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  console.log("WebSocket client connected. Total clients:", clients.length);

  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
    console.log("WebSocket client disconnected. Total clients:", clients.length);
  });
});

// Endpoint for Lambda or Postman to POST JSON alert data
app.post("/send-alert", (req, res) => {
  const alertData = req.body;

  // Broadcast to all connected clients
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(alertData));
    }
  });

  res.status(200).json({ status: "Delivered to WebSocket clients" });
});
