import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path'; // You may still use path for some operations like registration number
import fs from 'fs'; // Used for Base64 conversion (if needed for other tasks)

const app = express();
const port = 6009;

app.use(express.json()); // To parse JSON data in the body of POST requests
app.use(cors({
  origin: [
    "http://localhost:5174",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ]
}));

mongoose.connect("mongodb://127.0.0.1:27017/studentcardID")
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Define the student schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  registrationNumber: { type: String, unique: true, required: true },
  image: { type: String }, // Store Base64 string of the image
});

const Student = mongoose.model('Studentcard', studentSchema);

// Handle POST request to save student data (including Base64 image)
app.post('/api/students', async (req, res) => {
  const { name, fatherName, phoneNumber, image } = req.body;

  if (!name || !fatherName || !phoneNumber || !image) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newStudent = new Student({
    name,
    fatherName,
    phoneNumber,
    registrationNumber: `${Date.now()}`, // Generate unique registration number
    image, // Directly save Base64 image data to the database
  });

  try {
    const savedStudent = await newStudent.save();
    res.json({ registrationNumber: savedStudent.registrationNumber });
  } catch (err) {
    res.status(400).json({ error: 'Error saving student data' });
  }
});

// Handle GET request to fetch student data
app.get('/api/students/:registrationNumber', async (req, res) => {
  const { registrationNumber } = req.params;

  try {
    const student = await Student.findOne({ registrationNumber });
    if (student) {
      // Include Base64 image data in the response
      const studentData = {
        ...student.toObject(),
        image: student.image ? `data:image/jpeg;base64,${student.image}` : null,
      };
      res.json(studentData);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching student data' });
  }
});

app.listen(port, () => console.log(`Server running on port:${port}`));
