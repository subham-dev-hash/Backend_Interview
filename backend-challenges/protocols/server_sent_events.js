/**
 * Build a stock price ticker. The server pushes updates to the client over a single HTTP connection. No WebSockets.
 * 
 * Server Sent Events
 * 
 * Unidirectional Data Flow and HTTP/2
 * 
 */

import express from 'express';
import cors from 'cors'
const app = express();

app.use(cors());

app.get("/events", (req, res) => {
    console.log("Request received...")
    res.setHeader('Content-Type', "text/event-stream");
    res.setHeader('Cache-Control', "on-cache");
    res.setHeader('Connection', "keep-alive");

    res.write(`data: Connected to server\n\n`);

    let counter = 0;
    const intervalId = setInterval(() => {
        counter++;
        res.write(`data: Message ${counter}\n\n`);
    }, 2000);

    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    })
});

const PORT = 3011;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})

