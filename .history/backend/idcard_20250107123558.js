import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';  // Import multer for file upload handling

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

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/studentcardID")
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Set up Multer storage
const storage = multer.memoryStorage(); // Store the image in memory as a Buffer
const upload = multer({ storage: storage });

// Student Schema (with image field)
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  registrationNumber: { type: String, unique: true, required: true },
  image: { type: Buffer }  // Store image as Buffer
});

const Student = mongoose.model('Studentcard', studentSchema);


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
    image: file ? file.buffer : null,  // Store the image as a Buffer (if uploaded)
  });

  try {
    const savedStudent = await newStudent.save();
    res.json({ registrationNumber: savedStudent.registrationNumber });
  } catch (err) {
    res.status(400).json({ error: 'Error saving student data' });
  }
});

// GET route to fetch student data by registration number
app.get('/api/students/:registrationNumber', async (req, res) => {
  const { registrationNumber } = req.params;

  try {
    const student = await Student.findOne({ registrationNumber });
    if (student) {
      // Convert image (Buffer) to base64 if image exists
      const studentData = {
        ...student.toObject(),
        image: student.image ? student.image.toString('base64') : null, // Return base64 image string
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
