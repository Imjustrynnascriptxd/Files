const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Define the thread schema
const threadSchema = new mongoose.Schema({
  author: { type: String, required: true },
  topic: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Thread = mongoose.model("Thread", threadSchema);

// Middleware
app.use(bodyParser.json());

// API routes
app.get("/api/threads", async (req, res) => {
  try {
    const threads = await Thread.find().sort({ timestamp: -1 });
    res.json(threads);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.post("/api/threads", async (req, res) => {
  try {
    const thread = new Thread(req.body);
    await thread.save();
    res.status(201).json(thread);
  } catch (err) {
    console.error(err);
    res.status(400).send("Error saving thread");
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
