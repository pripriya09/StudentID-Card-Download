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
  const [image, setImage] = useState(null);  // State to hold image data

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:6009/api/students", formData);
      const result = response.data;

      setStudentData({
        ...formData,
        registrationNumber: result.registrationNumber,
        image: image || "https://www.w3schools.com/w3images/avatar2.png", // default demo image if none uploaded
      });

      setFormData({
        name: "",
        fatherName: "",
        phoneNumber: "",
      });
      setImage(null); // Reset image after form submission
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
        setImage(reader.result);
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
        <input
          type="file"
          onChange={handleImageChange}
        />
        <button type="submit">Register</button>
      </form>

      {studentData && (
        <div className="id-card" style={{ display: "flex", flexDirection: "row", border: "1px solid #ccc", padding: "20px", width: "500px", height: "200px" }}>
          <img
            src={studentData.image}
            alt="Profile"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
          <div className="text-container" style={{ marginLeft: "20px" }}>
            <p>Name: {studentData.name}</p>
            <p>Father's Name: {studentData.fatherName}</p>
            <p>Phone Number: {studentData.phoneNumber}</p>
            <p>Registration Number: {studentData.registrationNumber}</p>
            <button onClick={handleDownloadtext}>Download Card In txtfile</button>
            <button onClick={handleDownloadPDF}>Download Card In PDF</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
