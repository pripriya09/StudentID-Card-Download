import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import jsPDF from "jspdf";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    phoneNumber: "",
    image: null, // Added image field
  });
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [studentData, setStudentData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("fatherName", formData.fatherName);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    if (formData.image) {
      formDataToSend.append("image", formData.image);  // Append the image file
    }
  
    try {
      const response = await axios.post("http://localhost:6009/api/students", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const result = response.data;
      // Handle response here
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleDownloadtext = () => {
    if (studentData) {
      const fileData = `Name: ${studentData.name}
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
        image: null,
      });
      setStudentData(null);
    }
  };

  function handleDownloadPDF() {
    if (studentData) {
      let PDFdocument = new jsPDF();
      const studentInfo = `
        Student ID Card
        Name: ${studentData.name}
        Father's Name: ${studentData.fatherName}
        Phone: ${studentData.phoneNumber}
        Registration Number: ${studentData.registrationNumber}
      `;

      PDFdocument.text(studentInfo, 10, 10);
      PDFdocument.save(`${studentData.registrationNumber}_ID_Card.pdf`);
      PDFdocument = null;
    }
  }

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
        {/* Image input */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>

      {studentData && (


        <div className="id-card">
          
          <h3>ID Card</h3>
          <p>Name: {studentData.name}</p>
          <p>Father's Name: {studentData.fatherName}</p>
          <p>Phone Number: {studentData.phoneNumber}</p>
          <p>Registration Number: {studentData.registrationNumber}</p>
        
          <button onClick={handleDownloadtext}>Download Card In txtfile</button>
          <button onClick={handleDownloadPDF}>Download Card In PDF</button>
        </div>
      )}
    </div>
  );
};

export default Form;
