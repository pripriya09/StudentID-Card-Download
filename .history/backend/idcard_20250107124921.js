import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';  // Import multer for file upload handling
import path from 'path';  // Import path module

const app = express();
const port = 6009;

// Middleware for parsing JSON and handling CORS
app.use(express.json());
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


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  registrationNumber: { type: String, unique: true, required: true },
  image: { type: String },  // Store image path (not Buffer)
});

const Student = mongoose.model('Studentcard', studentSchema);

// POST route to create new student
app.post('/api/students', upload.single('image'), async (req, res) => {
  const { name, fatherName, phoneNumber } = req.body;
  const { file } = req;

  if (!name || !fatherName || !phoneNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newStudent = new Student({
    name,
    fatherName,
    phoneNumber,
    registrationNumber: `${Date.now()}`,  // Generate unique registration number
    image: file ? `/uploads/${file.filename}` : null,  // Store image path in the database
  });

  try {
    const savedStudent = await newStudent.save();
    res.json({ registrationNumber: savedStudent.registrationNumber });
  } catch (err) {
    res.status(400).json({ error: 'Error saving student data' });
  }
});

// GET route to fetch student details by registration number
app.get('/api/students/:registrationNumber', async (req, res) => {
  const { registrationNumber } = req.params;

  try {
    const student = await Student.findOne({ registrationNumber });
    if (student) {
      const studentData = {
        ...student.toObject(),
        image: student.image ? `${req.protocol}://${req.get('host')}${student.image}` : null, // Create full image URL
      };
      res.json(studentData);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching student data' });
  }
});

// Start the server
app.listen(port, () => console.log(`Server running on port:${port}`));
