import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();
const port =6009
app.use(express.json()); 

app.use(cors({
  origin:[
    "http://localhost:5174",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ]
  ,
}
  
));
mongoose.connect("mongodb://127.0.0.1:27017/studentcardID")
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
  console.log("respnse",req.body)
  if (!name || !fatherName || !phoneNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newStudent = new Student({
    name,
    fatherName,
    phoneNumber,
    registrationNumber: `${Date.now()}`,  // Generate unique registration number
  });
console.log(newStudent)
  try {
    const savedStudent = await newStudent.save();
    res.json({ registrationNumber: savedStudent.registrationNumber });
    console.log(savedStudent)
  } catch (err) {
    res.status(400).json({ error: 'Error saving student data' });
  }
});


app.get('/api/students/:registrationNumber', async (req, res) => {
  const { registrationNumber } = req.params;

  try {
    const student = await Student.findOne({ registrationNumber });
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching student data' });
  }
});

app.listen(port, () => console.log(`Server running on port:${port}`));




