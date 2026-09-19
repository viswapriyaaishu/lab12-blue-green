// change1 made here in file server.js
const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const VERSION = process.env.VERSION || "v1";

app.get("/", (req, res) => {
    res.json({
        message: "Blue-Green Deployment Application",
        version: VERSION
    });
});

app.get("/status", (req, res) => {
    res.json({
        status: "UP",
        version: VERSION
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});