import express from "express";
import axios from "axios";
import statusMonitor from "express-status-monitor";

const app = express();
app.use(statusMonitor());

const PORT = 3010;
const CLIENT_COUNT = 100;
const MODE = "long"; // "short" or "long"

let latestData = null;
let waitingClients = [];

let shortRequests = 0;
let longRequests = 0;
let longResponses = 0;

let lastCpu = process.cpuUsage();


app.get("/", (req, res) => {
  res.json({ message: "Server running" });
});

app.get("/short", (req, res) => {
  shortRequests++;

  res.json({
    type: "short",
    data: latestData,
    timestamp: Date.now(),
  });
});

app.get("/long", (req, res) => {
  longRequests++;

  const timeout = setTimeout(() => {
    waitingClients = waitingClients.filter((client) => client.res !== res);

    res.json({
      type: "timeout",
      message: "No new data",
      timestamp: Date.now(),
    });
  }, 20000);

  waitingClients.push({ res, timeout });
});

setInterval(() => {
  latestData = {
    message: "New data available",
    timestamp: Date.now(),
  };

  console.log( `\n[DATA] New update generated | notifying ${waitingClients.length} long clients`);

  waitingClients.forEach((client) => {
    clearTimeout(client.timeout);

    client.res.json({
      type: "update",
      data: latestData,
    });

    longResponses++;
  });

  waitingClients = [];
}, 15000);

setInterval(() => {
  const cpu = process.cpuUsage(lastCpu);
  lastCpu = process.cpuUsage();

  console.log("\n================ LOAD METRICS =================");
  console.log(`Mode                : ${MODE}`);
  console.log(`Clients             : ${CLIENT_COUNT}`);
  console.log(`Short requests      : ${shortRequests}`);
  console.log(`Long requests       : ${longRequests}`);
  console.log(`Long responses      : ${longResponses}`);
  console.log(`Open long clients   : ${waitingClients.length}`);
  console.log(`CPU user (last 5s)  : ${cpu.user}`);
  console.log(`CPU sys  (last 5s)  : ${cpu.system}`);
  console.log("===============================================\n");
}, 5000);

function startShortPollingClient(id) {
  setInterval(async () => {
    try {
      await axios.get(`http://localhost:${PORT}/short`);
    } catch (err) {
      console.error(`[SHORT CLIENT ${id}] ${err.message}`);
    }
  }, 1000);
}

async function startLongPollingClient(id) {
  try {
    await axios.get(`http://localhost:${PORT}/long`);
  } catch (err) {
    console.error(`[LONG CLIENT ${id}] ${err.message}`);
  }

  startLongPollingClient(id);
}

function startLoad() {
  console.log( `Starting ${CLIENT_COUNT} ${MODE}-polling clients...\n`);
  for (let i = 1; i <= CLIENT_COUNT; i++) {
    if (MODE === "short") {
      startShortPollingClient(i);
    } else {
      startLongPollingClient(i);
    }
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startLoad();
});