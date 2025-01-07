import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "./App.css";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    phoneNumber: "",
    image: null,
  });
  const [studentData, setStudentData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // For the image preview

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("fatherName", formData.fatherName);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      // Send form data to the server (make sure the server URL is correct)
      const response = await axios.post("http://localhost:6009/api/students", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const registrationNumber = response.data.registrationNumber;

      // Fetch student data, including the image URL
      const studentResponse = await axios.get(`http://localhost:6009/api/students/${registrationNumber}`);
      setStudentData(studentResponse.data);

      // Clear form data after submission
      setFormData({
        name: "",
        fatherName: "",
        phoneNumber: "",
        image: null,
      });
      setPreviewImage(null); // Clear the preview image
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Handle input field changes
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
      setPreviewImage(URL.createObjectURL(e.target.files[0])); // Update preview image when file is selected
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle text file download
  const handleDownloadText = () => {
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
    }
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
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
       V
        <button type="submit">Register</button>
      </form>

      
      <div className="id-card">
        <div className="left">
          <div className="circle">
            <img
              className="profile-img"
              src={previewImage || (studentData ? studentData.image : "https://via.placeholder.com/150")}
              alt="Student"
            />
          </div>
        </div>
        <div className="right">
          {studentData ? (
            <>
              <h3>ID Card</h3>
              <p>Name: {studentData.name}</p>
              <p>Father's Name: {studentData.fatherName}</p>
              <p>Phone Number: {studentData.phoneNumber}</p>
              <p>Registration Number: {studentData.registrationNumber}</p>
            </>
          ) : (
            <>
              <h3>Demo ID Card</h3>
              <p>Name: {formData.name || "John Doe"}</p>
              <p>Father's Name: {formData.fatherName || "Father Name"}</p>
              <p>Phone Number: {formData.phoneNumber || "000-000-0000"}</p>
              <p>Registration Number: Demo-12345</p>
            </>
          )}
        </div>
      </div>

      {/* Buttons to download ID card */}
      <button onClick={handleDownloadText}>Download Card In txtfile</button>
      <button onClick={handleDownloadPDF}>Download Card In PDF</button>
    </div>
  );
};

export default Form;
