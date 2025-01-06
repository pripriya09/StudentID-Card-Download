import express, { json } from 'express';
import { connect, Schema } from 'mongoose';


const app = express();
app.use(json());

// MongoDB Connection
connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/api/students', studentRoutes);

const studentSchema = new Schema({
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    registrationNumber: { type: String, unique: true, required: true },
  });


router.post('/', async (req, res) => {
    const { name, fatherName, phoneNumber } = req.body;
  
    const newStudent = new Student({
      name,
      fatherName,
      phoneNumber,
      registrationNumber: `REG-${Date.now()}`,
    });
  
    const savedStudent = await newStudent.save();
    res.json({ registrationNumber: savedStudent.registrationNumber });
  });

app.listen(5000, () => console.log('Server running on port 5000'));
