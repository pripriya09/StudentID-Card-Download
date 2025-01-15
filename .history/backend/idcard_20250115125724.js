import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = 6009;

app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
    ],
  })
);

mongoose
  .connect("mongodb://127.0.0.1:27017/studentcardID", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Database connection error:", err));

// Define the schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  registrationNumber: { type: String, unique: true, required: true },
  image: { type: String }, // Base64 image
  address: { type: String, required: true },
  consent: { type: Boolean, required: true },
  disease: { type: String, required: true },
  reference: { type: String, required: true },
});

// Create the model
const Student = mongoose.model("Studentcard", studentSchema);

// Endpoint to register students
app.post("/api/students", async (req, res) => {
  const { passengers, consent } = req.body;

  if (!consent) {
    return res.status(400).json({ error: "Consent is required for registration." });
  }

  if (!Array.isArray(passengers) || passengers.length === 0) {
    return res.status(400).json({ error: "No passengers provided." });
  }

  try {
    const savedPassengers = [];

    for (const passenger of passengers) {
      const { name, fatherName, phoneNumber, image, address, disease, reference } = passenger;

      if (!name || !fatherName || !phoneNumber || !image || !address || !disease || !reference) {
        return res.status(400).json({ error: "All fields including image are required." });
      }

      const newStudent = new Student({
        name,
        fatherName,
        phoneNumber,
        registrationNumber: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        image,
        address,
        consent,
        disease,
        reference,
      });

      const savedStudent = await newStudent.save();
      savedPassengers.push({
        registrationNumber: savedStudent.registrationNumber,
      });
    }

    res.json({ registrationNumbers: savedPassengers.map((student) => student.registrationNumber) });
  } catch (err) {
    console.error("Error saving passengers:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Endpoint to retrieve student by registration number
app.get("/api/students/:registrationNumber", async (req, res) => {
  const { registrationNumber } = req.params;

  try {
    const student = await Student.findOne({ registrationNumber });
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.json(student);
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
