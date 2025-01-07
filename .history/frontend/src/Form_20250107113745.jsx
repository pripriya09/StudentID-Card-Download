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
  const [profileImage, setProfileImage] = useState(null); // For the uploaded image

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Set the image as base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadtext = () => {
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
        {/* Upload profile image */}
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <button type="submit">Register</button>
      </form>

      {studentData && (
        <div className="id-card">
          <h3>ID Card</h3>
          {/* Display the profile image */}
          <div className="profile-image">
            {profileImage ? (
              <img src={profileImage} alt="Profile" />
            ) : (
              <img src="https://via.placeholder.com/150" alt="Demo Image" />
            )}
          </div>
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
