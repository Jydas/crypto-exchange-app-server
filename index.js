const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to funny exchange" });
});

app.listen(PORT, () => {
  console.log(`App listen on port ${PORT}`);
});
