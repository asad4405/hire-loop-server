import express from "express";
import 'dotenv/config';
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

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
const jobsCollection = db.collection('jobs');

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

// job api
app.get("/jobs", async (req, res) => {
    const query = {};

    if (req.query.search) {
        query.$or = [
            { title: { $regex: req.query.search, $options: "i" } },
            { company: { $regex: req.query.search, $options: "i" } },
            { location: { $regex: req.query.search, $options: "i" } },
        ];
    }

    if (req.query.title) {
        query.title = { $regex: req.query.title, $options: "i" };
    }
    if (req.query.company) {
        query.company = { $regex: req.query.company, $options: "i" };
    }
    if (req.query.location) {
        query.location = { $regex: req.query.location, $options: "i" };
    }
    if (req.query.jobType) {
        query.jobType = { $regex: `^${req.query.jobType}$`, $options: "i" };
    }
    if (req.query.category) {
        query.category = { $regex: `^${req.query.category}$`, $options: "i" };
    }
    if (req.query.frequency) {
        query.frequency = { $regex: `^${req.query.frequency}$`, $options: "i" };
    }
    if (req.query.isRemote !== undefined && req.query.isRemote !== "") {
        query.isRemote = req.query.isRemote === "true";
    }

    const result = await jobsCollection.find(query).toArray();
    res.send(result);
});

app.post("/jobs", async (req, res) => {
    const job = req.body;
    const result = await jobsCollection.insertOne(job);
    res.send(result);
});

app.delete("/jobs/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await jobsCollection.deleteOne(query);
    res.send(result);
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});