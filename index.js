const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5iwe9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("chaka");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    const usersCollection = database.collection("users");
    // product get api
    app.get("/products", async (req, res) => {
      const cursors = productsCollection.find();
      const result = await cursors.toArray();
      res.send(result);
    });
    // orders collection get method
    app.get("/orders", async (req, res) => {
      const cursors = ordersCollection.find();
      const result = await cursors.toArray();
      res.send(result);
    });
    // orders collection post method
    app.post("/orders", async (req, res) => {
      const body = req.body;
      const result = await ordersCollection.insertOne(body);
      res.json(result);
    });
    // user collection post method
    app.post("/users", async (req, res) => {
      const body = req.body;
      const result = await usersCollection.insertOne(body);
      res.json(result);
    });
    app.get("/users", async (req, res) => {
      const cursors = usersCollection.find();
      const result = await cursors.toArray();
      res.send(result);
    });
    // find users Admin
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.find(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      } else {
        isAdmin = false;
      }
      res.send(isAdmin);
    });
    console.log("database connect");
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("<h1>This is chaka server</h1>");
});

app.listen(port, () => {
  console.log("sucessfully run by", port);
});
