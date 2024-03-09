const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const Person = require("./person.js");

const app = express();

app.use(express.json());
app.use(express.static("dist"));

app.use(cors());

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res) => {
  const newNumber = {
    name: req.body.name,
    number: req.body.number,
  };

  if (req.body === undefined) {
    return res.status(400).end();
  }

  Person.findByIdAndUpdate(req.params.id, newNumber, {
    new: true,
    runValidators: true,
    context: "query",
  }).then((person) => {
    res.status(201).json(person);
  });
});

app.post("/api/persons", async (req, res, next) => {
  try {
    if (req.body.name === "") {
      return res.status(400).json({ error: "name missing" });
    }

    const isValidNum = req.body.number.includes("-");
    const numPartOne = req.body.number.split("-")[0];
    const validNum = numPartOne.length >= 2 && numPartOne.length <= 4;

    if (!isValidNum || !validNum) {
      return res.status(400).json({ error: "Invalid number format" });
    }

    const persons = await Person.find({});

    for (const person of persons) {
      if (person.name.toLowerCase() === req.body.name.toLowerCase()) {
        return res
          .status(200)
          .json({ message: "Person already exists in phonebook", person });
      }
    }

    const newPerson = new Person({
      name: req.body.name,
      number: req.body.number,
    });

    const savedPerson = await newPerson.save();
    res.status(201).json(savedPerson);
  } catch (error) {
    return next(error);
  }
});

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
