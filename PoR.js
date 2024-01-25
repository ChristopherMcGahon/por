require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();

var reserves = 1000000;

app.use(express.json());

app.get("/reserves", (req, res) => {
  res.send(reserves.toString());
});

// App listening on the below port
app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});

function reserveIncrease() {
  reserves += 100;
}

supplyMonitor = setInterval(async () => {
  console.log("Reserves: ", reserves);
  reserveIncrease();
}, 10000);
