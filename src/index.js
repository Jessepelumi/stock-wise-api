import serverless from "serverless-http";
import express from "express";
import { getDbClient } from "./db/client.js";
import * as validators from "./db/validators.js";
import * as crud from "./db/crud.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  const sql = await getDbClient();
  const [results] = await sql`select now();`;
  return res.status(200).json({
    message: "Hello from root!",
    results: results.now,
  });
});

app.get("/leads", async (req, res, next) => {
  try {
    const result = await crud.listLeads();

    if (result) {
      return res.status(200).json({
        message: "Data fetched successfully!",
        results: result,
      });
    } else {
      return res.status(404).json({
        error: "Table not found",
      });
    }
  } catch (error) {
    console.error("Error in listLeads function:", error);
    return res.status(400).json({
      error: "Bad request. No data returned from server.",
    });
  }
});

app.get("/leads/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await crud.getLead(id);

    if (result) {
      return res.status(200).json({
        message: "Data with specified id fetched successfully",
        results: result,
      });
    } else {
      return res.status(404).json({
        error: "Table not found",
      });
    }
  } catch (error) {
    console.error("Error in getLead function:", error);
    return res.status(400).json({
      error: "Bad request. No data returned from server.",
    });
  }
});

app.post("/leads", async (req, res, next) => {
  try {
    const postData = await req.body;
    const { data, hasError, message } = await validators.validateLeads(
      postData
    );

    if (hasError === true) {
      return res.status(400).json({
        message: message ? message : "There's been an error",
      });
    } else if (hasError === undefined) {
      return res.status(500).json({
        message: "Server Error -- an error occured",
      });
    }

    const result = await crud.newLead(data);

    return res.status(201).json({
      message: "Data inserted successfully",
      results: result,
    });
  } catch (error) {
    console.error("Error in newLead function:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.delete("/leads/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await crud.deleteLead(id);

    if (result) {
      return res.status(200).json({
        message: "Data with specified id deleted successfully",
        result: result,
      });
    } else {
      return res.status(404).json({
        error: "Table not found",
      });
    }
  } catch (error) {}
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);
