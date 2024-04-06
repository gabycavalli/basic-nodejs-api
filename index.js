import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
  });
});

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to myfirst API with Nodejs");
});

app.get("/api/v1/books", (req, res) => {
  const data = readData();
  res.json(data.books);
});

app.get("/api/v1/books/:id", async (req, res) => {
  const data = readData();
  try {
    const id = parseInt(req.params.id);
    const book = data.books.find((book) => book.id === id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/books", (req, res) => {
  const data = readData();
  const body = req.body;
  const newBook = {
    id: data.books.length + 1,
    ...body,
  };
  data.books.push(newBook);
  writeData(data);
  res.json(newBook);
});

app.put("/api/v1/books/:id", async (req, res) => {
  const data = readData();
  const body = req.body;
  try {
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    if (!book.id) {
      return res.status(404).json({ message: "Id or Index not found" });
    }
    data.books[bookIndex] = {
      ...data.books[bookIndex],
      ...body,
    };
  } catch (error) {
    next(error);
  }
  writeData(data);
  res.json({ message: "Book updated successfully" });
});

app.delete("/api/v1/books/:id", async (req, res) => {
  const data = readData();
  try {
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      return res.status(404).json({ message: "Id or Index not found" });
    }
    data.books.splice(bookIndex, 1);
    writeData(data);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el libro" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
