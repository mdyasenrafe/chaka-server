const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
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
    const reviewCollection = database.collection("review");

    // product get api
    app.get("/products", async (req, res) => {
      const cursors = productsCollection.find();
      const result = await cursors.toArray();
      res.send(result);
    });
    // product post api
    app.post("/products", async (req, res) => {
      const body = req.body;
      const result = await productsCollection.insertOne(body);
      res.json(result);
    });
    // product post api
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.json(result);
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
    // orders collection post method
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });
    // my orders update
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const newData = req.body;
      const updateDoc = {
        $set: {
          status: newData.status,
        },
      };
      const result = await ordersCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.json(result);
    });
    // user collection post method
    app.post("/users", async (req, res) => {
      const body = req.body;
      const result = await usersCollection.insertOne(body);
      res.json(result);
    });
    // users get method
    app.get("/users", async (req, res) => {
      const cursors = usersCollection.find();
      const result = await cursors.toArray();
      res.send(result);
    });
    // find users Admin
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      console.log(query);
      let isAdmin = false;
      console.log(user);
      if (user?.role === "admin") {
        isAdmin = true;
      } else {
        isAdmin = false;
      }
      res.send({ admin: isAdmin });
    });
    // get admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          role: user.role,
        },
      };
      console.log("usersCollection", usersCollection);
      const result = await usersCollection.updateOne(query, updateDoc, options);
      console.log(result);
      res.json(result);
    });
    // reviews get method
    app.get("/reviews", async (req, res) => {
      const cursors = reviewCollection.find();
      const result = await cursors.toArray();
      res.send(result);
    });
    // reviews get method
    app.post("/reviews", async (req, res) => {
      const body = req.body;
      const result = await reviewCollection.insertOne(body);
      res.json(result);
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
