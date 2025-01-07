const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const app = express();

// Setup CORS to allow cross-origin requests (for frontend to backend communication)
app.use(cors());

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination folder for storing uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename
  },
});

const upload = multer({ storage: storage });

// Example database (you can use MongoDB, MySQL, etc.)
let students = [];

app.post("/api/students", upload.single("image"), (req, res) => {
  const { name, fatherName, phoneNumber } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null; // Image URL

  // Simulate saving to a database (e.g., MongoDB, MySQL)
  const newStudent = {
    name,
    fatherName,
    phoneNumber,
    registrationNumber: "REG" + Math.floor(Math.random() * 10000),
    image, // Save image URL in the database
  };

  students.push(newStudent);

  res.json({ registrationNumber: newStudent.registrationNumber });
});

// Fetch student details
app.get("/api/students/:registrationNumber", (req, res) => {
  const student = students.find(
    (student) => student.registrationNumber === req.params.registrationNumber
  );
  if (student) {
    res.json(student);
  } else {
    res.status(404).send("Student not found");
  }
});

app.listen(6009, () => {
  console.log("Server running on port 6009");
});
