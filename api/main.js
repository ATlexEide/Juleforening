import express from "express";
import * as fs from "fs";
import { filterFamilies } from "./modules/handleFilterRequest.js";
import { updateFamily } from "./modules/handlePutRequest.js";
import { deleteFamily } from "./modules/handleDeleteRequest.js";
import { createFamily } from "./modules/handlePostRequest.js";
import cors from "cors";

const app = express();
const port = 8080;
let families;
function fetchData() {
  fs.readFile("api/data/families.json", function (err, data) {
    if (err) throw err;
    families = JSON.parse(data.toString());
  });
}
function updateData() {
  fs.writeFile("api/data/families.json", JSON.stringify(families), () => {
    fetchData();
  });
}
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server root");
});
// Get a list of all families
app.get("/families", (req, res) => {
  res.send(families);
});
// Filter familes based on set preferences
app.get("/families/filter/preferences", (req, res) => {
  res.send(filterFamilies(req.query, families));
});
//// Update a family
// Expects key value pair for propert(y(ies)) to update
app.put("/families/:familyId/edit", (req, res) => {
  updateFamily(req, families);
  res.send(`Edited family ${req.params.familyId}`);
  updateData();
});
// Delete a family
app.delete("/families/:familyId/delete", (req, res) => {
  deleteFamily(req, families);
  updateData();
  res.send(`Deleted family ${req.params.familyId}`);
});
//// Add a family
// Expects a body with all family properties
app.post("/families/create", (req, res) => {
  createFamily(req, families);
  updateData();
  res.send(`Created family`);
});

app.listen(port, () => {
  console.log(`Server runnning on port ${port}`);
  fetchData();
});
