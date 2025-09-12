import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Response sent");
});

export default app;
