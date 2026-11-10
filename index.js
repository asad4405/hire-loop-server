import express from "express";
import 'dotenv/config';
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
const PORT = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(`${process.env.MONGODB_URL}`);

export async function connectToMongoDB() {
    try {
        await client.connect();
        return client;
    } catch (err) {
        console.dir(err);
    }
}

const connectedClient = await connectToMongoDB();
const db = connectedClient.db('hire-loop');
const usersCollection = db.collection('user');

app.get("/", (req, res) => {
    res.send("Server Running...");
});
app.get("/users", async (req, res) => {
    try {
        const users = await usersCollection.find({}).toArray();
        res.json(users);
    } catch (err) {
        console.dir(err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});