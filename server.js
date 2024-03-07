import express from "express";
import persons from "./persons.js";
import { formattedDate, deleteItem, addItem } from "./utils/helpers.js";

const app = express();

app.use(express.json());

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${formattedDate}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((person) => person.id === Number(req.params.id));

  if (!person) {
    return res.status(401).json({ message: "Person not found" });
  }

  res.json({ person });
});

app.delete("/api/persons/:id", (req, res) => {
  const person = persons.find((person) => person.id === Number(req.params.id));

  if (!person) {
    return res.status(401).json({ message: "This person is not in phonebook" });
  }

  deleteItem(Number(req.params.id));
  res.json({ message: `${person.name} has been deleted from phonebook` });
});

app.post("/api/persons", (req, res) => {
  const data = req.body;

  const numberExist = persons.find(
    (person) => person.number === req.body.number
  );

  if (numberExist) {
    return res.status(400).json({ error: "Number already exist in phonebook" });
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "Body cannot be empty" });
  } else if (!data.name) {
    return res.status(400).json({ error: "Name must be unique" });
  } else if (!data.number) {
    return res.status(400).json({ error: "Number must be unique" });
  } else {
    addItem(data);
    res.status(201).json({ message: "Added to phonebook" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
