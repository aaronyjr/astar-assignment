const express = require("express");
const axios = require("axios");
const app = express();
require(`dotenv`).config();

const PORT = process.env.PORT || 3000;

app.use(express.json());

async function getJwtToken() {
  try {
    const params = new URLSearchParams({
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      client_id: process.env.CLIENT_ID,
      grant_type: process.env.GRANT_TYPE,
      client_secret: process.env.CLIENT_SECRET,
      scope: process.env.SCOPE,
    });

    const response = await axios.post(process.env.AUTH_URL, params, {
      headers: {
        __tenant: process.env.TENANT_ID,
        "Content-Type": process.env.CONTENT_TYPE,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Error retrieving JWT token:", error.message);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
    throw new Error("Authentication failed");
  }
}

app.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`);
});
