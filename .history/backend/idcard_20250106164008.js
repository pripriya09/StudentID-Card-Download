import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json()); 


mongoose.connect("mongodb://localhost:27017/studentcardID")
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  registrationNumber: { type: String, unique: true, required: true },
});


const Student = mongoose.model('Studentcard', studentSchema);

app.post('/api/students', async (req, res) => {
  const { name, fatherName, phoneNumber } = req.body;

  const newStudent = new Student({
    name,
    fatherName,
    phoneNumber,
    registrationNumber: `REG-${Date.now()}`, 
  });

  try {
    const savedStudent = await newStudent.save();
    res.json({ registrationNumber: savedStudent.registrationNumber });
  } catch (err) {
    res.status(400).json({ error: 'Error saving student data' });
  }
});


app.listen(5000, () => console.log('Server running on port 5000'));
