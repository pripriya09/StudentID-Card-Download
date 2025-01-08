import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = 6009;

app.use(express.json({ limit: '50mb' }));  // Increase the body size limit to 50MB
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


  const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    consent: { type: Boolean, default: false }, // New consent field
    registrationNumber: { type: String, unique: true, required: true },
  });
  
  module.exports = mongoose.model("Student", studentSchema);
  

const Student = mongoose.model('Studentcard', studentSchema);

app.post("/api/students", async (req, res) => {
  const { name, fatherName, phoneNumber, image, address, consent } = req.body;

  // Validate consent
  if (!consent) {
    return res.status(400).json({ error: "Consent is required." });
  }

  // Proceed with storing data in the database
  const newStudent = {
    name,
    fatherName,
    phoneNumber,
    image,
    address,
    registrationNumber: generateRegistrationNumber(), // Function to generate reg. number
  };

  // Save to database (example code)
  try {
    await Student.create(newStudent);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: "Error saving student data" });
  }
});

// GET endpoint to retrieve student data by registration number
app.get('/api/students/:registrationNumber', async (req, res) => {
  const { registrationNumber } = req.params;

  try {
    const student = await Student.findOne({ registrationNumber });
    if (student) {
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
