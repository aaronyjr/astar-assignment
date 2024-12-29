const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
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

app.get("/groups", async (req, res) => {
  try {
    const token = await getJwtToken();

    const response = await axios.get(process.env.GROUP_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error retrieving groups:", error.message);
    res.status(500).json({ error: "Failed to retrieve groups" });
  }
});

app.get("/create-group", (req, res) => {
  res.render("create-group");
});

app.post("/create-group", async (req, res) => {
  const name = req.body.name;
  try {
    const token = await getJwtToken();
    const names = generateListOfNames(name);

    const createGroups = names.map((name) => {
      return axios.post(
        process.env.GROUP_URL,
        { name: name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    });

    await Promise.all(createGroups);
    res.status(200).json({ message: "Groups created successfully" });
  } catch (error) {
    console.error(
      "Error creating groups:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "Failed to create groups", error: error.message });
  }
});

function generateListOfNames(name) {
  let result = [];
  for (let i = 1; i <= 5; i++) {
    const element = name + "-Group" + i.toString();
    result.push(element);
  }
  return result;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
