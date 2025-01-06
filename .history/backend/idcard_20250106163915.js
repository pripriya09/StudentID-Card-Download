import express from 'express';
import mongoose from 'mongoose';


const app = express();
app.use(json());


mongoose.connect("mongodb://localhost:27017/studentcardID")
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Define the student schema
const studentSchema = new mongooseSchema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  registrationNumber: { type: String, unique: true, required: true },
});

// Create the student model
const Student = mongoose.model('Studentcard', studentSchema);

// Define the POST route to create a new student and generate registration number
app.post('/api/students', async (req, res) => {
  const { name, fatherName, phoneNumber } = req.body;

  const newStudent = new Student({
    name,
    fatherName,
    phoneNumber,
    registrationNumber: `REG-${Date.now()}`, // Unique registration number based on timestamp
  });

  try {
    const savedStudent = await newStudent.save();
    res.json({ registrationNumber: savedStudent.registrationNumber });
  } catch (err) {
    res.status(400).json({ error: 'Error saving student data' });
  }
});

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
