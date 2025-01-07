import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import jsPDF from "jspdf";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    phoneNumber: "",
  });
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [studentData, setStudentData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:6009/api/students", formData);
      const result = response.data;

      setStudentData({
        ...formData,
        registrationNumber: result.registrationNumber,
      });

      setFormData({
        name: "",
        fatherName: "",
        phoneNumber: "",
      });
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDownloadText = () => {
    if (studentData) {
      const fileData = `
        Name: ${studentData.name}
        Father's Name: ${studentData.fatherName}
        Phone Number: ${studentData.phoneNumber}
        Registration Number: ${studentData.registrationNumber}`;
      const blob = new Blob([fileData], { type: "text/plain" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${studentData.registrationNumber}_ID_Card.txt`;
      link.click();

      setFormData({
        name: "",
        fatherName: "",
        phoneNumber: "",
      });
      setStudentData(null);
    }
  };

  const handleDownloadPDF = () => {
    if (studentData) {
      const pdf = new jsPDF();
      const studentInfo = `
        Student ID Card
        Name: ${studentData.name}
        Father's Name: ${studentData.fatherName}
        Phone: ${studentData.phoneNumber}
        Registration Number: ${studentData.registrationNumber}`;
      
      pdf.text(studentInfo, 10, 10);
      pdf.save(`${studentData.registrationNumber}_ID_Card.pdf`);
    }
  };

  return (
    <div className="App">
      <h2>Student Registration</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="fatherName"
          placeholder="Father's Name"
          value={formData.fatherName}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>

      {studentData && (

<div class="student_id">
<!-- Top section with profile photo and student name/age -->
<div class="top_section">
  <div class="profile_photo">
    <!-- Placeholder for profile photo -->
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Arnold_Schwarzenegger_by_Gage_Skidmore_4.jpg/220px-Arnold_Schwarzenegger_by_Gage_Skidmore_4.jpg" alt="Profile Photo">
  </div>
  <div class="student_name">
    <ul class="student_info">
   
      <li class="name">{studentData.name}</li>
    
      <li class="age"><span class="bold">Age: 20</span></li>
    </ul>
  </div>
</div>
etails --><!-- Bottom section with student d
<div class="bottom_section">
  <div class="student_details">
    <ul>
      <!-- Student ID -->
      <li><span class="bold">ID:</span> 525710</li>
      <!-- Student course -->
      <li><span class="bold">Course:</span> Full Stack Software Development</li>
      <!-- Student year -->
      <li><span class="bold">Class:</span> Bootcamp</li>
    </ul>
  </div>
</div>
</div>
// <button onClick={handleDownloadText}>Download Card In Text File</button>
// <button onClick={handleDownloadPDF}>Download Card In PDF</button>
        {/* <div className="id-card">
          <h3>ID Card</h3>
          <p>Name: {studentData.name}</p>
          <p>Father's Name: {studentData.fatherName}</p>
          <p>Phone Number: {studentData.phoneNumber}</p>
          <p>Registration Number: {studentData.registrationNumber}</p>
         
        </div>  */}
      )}
    </div>
  );
};

export default Form;
