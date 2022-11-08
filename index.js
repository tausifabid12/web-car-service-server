const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { response } = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("car server running");
});

//db connection

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.brxmqep.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbConnect() {
  try {
    await client.connect();
    console.log("bd connected");
  } catch (error) {
    console.log(error.name, error.message);
  }
}

dbConnect();

//collections
const serviceCollection = client.db("web-car-services").collection("services");
const ordersCollection = client.db("web-car-services").collection("orders");

//apis

//getting all service data
app.get("/services", async (req, res) => {
  try {
    let query = {};
    if (req.query.email) {
      query = {
        email: req.query.email,
      };
    }
    const cursor = serviceCollection.find(query);
    const services = await cursor.toArray();

    res.send(services);
  } catch (error) {
    console.log(error.name, error.message);
  }
});

//getting selected service

app.delete("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: ObjectId(id) };
    const result = await ordersCollection.deleteOne(query);
    res.send(result);
  } catch {}
});

// deleting selected services
app.get("/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: ObjectId(id) };
    const result = await serviceCollection.findOne(query);
    res.send(result);
  } catch {}
});

//getting user orders
app.get("/orders", async (req, res) => {
  try {
    console.log(req.query);
    let query = {};

    if (req.query.email) {
      query = {
        email: req.query.email,
      };
    }
    const cursor = ordersCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
  } catch {}
});

//inserting user's order data
app.post("/orders", async (req, res) => {
  try {
    console.log(req.body);
    const result = await ordersCollection.insertOne(req.body);
    res.send({
      success: true,
      message: "your order is placed",
      data: result,
    });
  } catch (error) {
    console.log(error.name, error.message);
  }
});
app.listen(port, () => {
  console.log("server is running");
});
