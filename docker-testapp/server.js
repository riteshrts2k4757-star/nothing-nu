const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;

const PORT = 5050;
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Added to support JSON payloads if needed
app.use(express.static("public"));

const MONGO_URL = "mongodb://admin:qwerty@3.87.222.203:27017/?authSource=admin";
const client = new MongoClient(MONGO_URL);

// Connect once when the server starts
async function startServer() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB server");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}

// GET all users
app.get("/getUsers", async (req, res) => {
    try {
        const db = client.db("apnacollege-db");
        const data = await db.collection("users").find({}).toArray();
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching users");
    }
});

// POST new user
app.post("/addUser", async (req, res) => {
    try {
        const userObj = req.body;
        console.log(userObj);

        const db = client.db("apnacollege-db");
        const data = await db.collection("users").insertOne(userObj);
        
        console.log("Data inserted in DB");
        res.send({ success: true, message: "User added successfully", data });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error inserting user");
    }
});

startServer();