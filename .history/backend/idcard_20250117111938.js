import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// import { nanoid } from "nanoid"; // Import nanoid for unique ID generation

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
  .connect("mongodb://127.0.0.1:27017/studentcardID")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Database connection error:", err));

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  registrationNumber: { type: String, unique: true, required: true },
  image: { type: String },
  address: { type: String, required: true },
  consent: { type: Boolean, required: true },
  disease: { type: String, required: true },
  reference: { type: String, required: true },
});

const Student = mongoose.model("Studentcard", studentSchema);

let lastRegistrationNumber = 0;  // Start from 9 (SKSSS0009)

const generateRandomPrefix = () => {
  const letters = "SKSSS";
  return letters;
};

const generateRegistrationNumber = () => {
  // Increment the last registration number and format it to 4 digits with leading zeros
  lastRegistrationNumber++;
  const uniqueNumber = String(lastRegistrationNumber).padStart(4, '0');
  return `${generateRandomPrefix()}${uniqueNumber}`;
};

// Inside your /api/students endpoint
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

      const registrationNumber = generateRegistrationNumber();

      // Check if the registration number already exists in the database (to avoid duplicates)
      const existingStudent = await Student.findOne({ registrationNumber });

      if (existingStudent) {
        return res.status(400).json({ error: `Duplicate registration number ${registrationNumber}.` });
      }

      const newStudent = new Student({
        name,
        fatherName,
        phoneNumber,
        registrationNumber,
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

app.get("/api/students",async(req,res))



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


app.listen(port, () => console.log(`Server running on port ${port}`));




