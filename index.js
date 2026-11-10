import express from "express";
import 'dotenv/config';
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;

// middleware
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server Running...");
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});