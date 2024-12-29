const express = require("express");
const axios = require("axios");
const app = express();
require(`dotenv`).config();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`);
});
