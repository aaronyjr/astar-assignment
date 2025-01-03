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
    const AUTH_URL = "https://dev-apex-01.southeastasia.cloudapp.azure.com:7600/connect/token";
    const TENANT_ID = "T003";
    const CONTENT_TYPE = "application/x-www-form-urlencoded";
    const USERNAME = "applicant";
    const PASSWORD = "881d&793M";
    const CLIENT_ID = "External_Integration";
    const GRANT_TYPE = "password";
    const CLIENT_SECRET = "3a165ec4-6a3f-a19e-657c-0739e26cb85e";
    const SCOPE = "PartnerService";

    const params = new URLSearchParams({
      username: USERNAME,
      password: PASSWORD,
      client_id: CLIENT_ID,
      grant_type: GRANT_TYPE,
      client_secret: CLIENT_SECRET,
      scope: SCOPE,
    });

    const response = await axios.post(AUTH_URL, params, {
      headers: {
        __tenant: TENANT_ID,
        "Content-Type": CONTENT_TYPE,
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
