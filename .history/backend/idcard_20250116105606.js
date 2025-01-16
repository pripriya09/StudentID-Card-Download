import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { nanoid } from "nanoid";

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
  image: { type: String }, // Base64 image
  address: { type: String, required: true },
  consent: { type: Boolean, required: true },
  disease: { type: String, required: true },
  reference: { type: String, required: true },
});

const Student = mongoose.model("Studentcard", studentSchema);

app.post("/api/students", async (req, res) => {
  const { passengers, consent } = req.body;

  if (!consent) {
    return res.status(400).json({ error: "Consent is required for registration." });
  }

  if (!Array.isArray(passengers) || passengers.length === 0) {
    return res.status(400).json({ error: "No passengers provided." });
  }

  if (passengers.length > 10) {
    return res.status(400).json({ error: "You can register a maximum of 10 passengers at a time." });
  }

  try {
    const savedPassengers = [];
    const errors = [];

    for (const passenger of passengers) {
      try {
        const { name, fatherName, phoneNumber, image, address, disease, reference } = passenger;

        if (!name || !fatherName || !phoneNumber || !image || !address || !disease || !reference) {
          throw new Error("All fields including image are required.");
        }

        // Generate a unique 12-character registration number
        const registrationNumber = nanoid(12);

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
      } catch (err) {
        if (err.code === 11000) {
          errors.push(
            `Duplicate registration number: ${err.keyValue.registrationNumber}`
          );
        } else {
          errors.push(err.message || "Error saving passenger.");
        }
      }
    }

    res.status(207).json({
      success: savedPassengers,
      errors,
    });
  } catch (err) {
    console.error("Error processing passengers:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
