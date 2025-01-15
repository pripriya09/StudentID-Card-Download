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
    "http://127.0.0.1:5174"
  ]
}));

mongoose.connect("mongodb://127.0.0.1:27017/studentcardID")
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  registrationNumber: { type: String, unique: true, required: true },
  image: { type: String },  
  address:{type: String},
  consent: { type: Boolean, required: true },
  disease: { type: String, required: true },
  reference : { type: String, required: true },
});

const Student = mongoose.model('Studentcard', studentSchema);


app.post('/api/students', async (req, res) => {
  const passengers = req.body.passengers;
  const { passengers, consent } = req.body;

  // Validate consent
  if (!consent) {
    return res.status(400).json({ error: 'Consent is required for registration.' });
  }

  if (!Array.isArray(passengers) || passengers.length === 0) {
    return res.status(400).json({ error: 'No passengers provided' });
  }

  try {
    const savedPassengers = [];
    
    // Loop over each passenger and save them
    for (const passenger of passengers) {
      const { name, fatherName, phoneNumber, image, address, consent ,disease,reference} = passenger;

      if (!name || !fatherName || !phoneNumber || !image || !address || consent === undefined || !disease ||!reference) {
        return res.status(400).json({ error: 'All fields including image and consent are required' });
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

    res.json({ registrationNumbers: savedPassengers.map(student => student.registrationNumber) });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error saving passenger data' });
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
