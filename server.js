const express = require("express");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Create WebSocket server
const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

const wss = new WebSocket.Server({ server });

// Store all connected clients
let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
  });
});

// Endpoint for Lambda to POST JSON
app.post("/send-alert", (req, res) => {
  const alertData = req.body;

  // Broadcast to all clients
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(alertData));
    }
  });

  res.status(200).json({ status: "Delivered to WebSocket clients" });
});
