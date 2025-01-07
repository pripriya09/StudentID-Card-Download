import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas"; // Import html2canvas
import "./App.css";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    phoneNumber: "",
    image: null,
  });
  const [studentData, setStudentData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:6009/api/students", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const registrationNumber = response.data.registrationNumber;

      const studentResponse = await axios.get(
        `http://localhost:6009/api/students/${registrationNumber}`
      );
      setStudentData(studentResponse.data);

      setFormData({
        name: "",
        fatherName: "",
        phoneNumber: "",
        image: null,
      });
      setPreviewImage(null);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(",")[1];
        setFormData({ ...formData, image: base64Image });
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle PDF download (including image and text)
  const handleDownloadPDF = () => {
    if (studentData) {
      let PDFdocument = new jsPDF();

      // Capture the ID card as an image using html2canvas
      const captureElement = document.getElementById("id-card");
      html2canvas(captureElement, { scale: 1.5 }).then((canvas) => {
        // Convert the captured canvas to an image data URL
        const imageData = canvas.toDataURL("image/png");

        // Add the image to the PDF with correct size and position
        PDFdocument.addImage(imageData, "PNG", 10, 10, 180, 250); // Adjust width and height

        // Add text information (if needed)
        const studentInfo = `
          Student ID Card
          Name: ${studentData.name}
          Father's Name: ${studentData.fatherName}
          Phone: ${studentData.phoneNumber}
          Registration Number: ${studentData.registrationNumber}
        `;
        PDFdocument.text(studentInfo, 10, 270); // Adjust text position as necessary

        // Save the PDF with both the image and text
        PDFdocument.save(`${studentData.registrationNumber}_ID_Card.pdf`);
      });
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
        <input
          type="file"
          name="image"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>

      <div className="id-card" id="id-card">
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
              
            </>
          )}
        </div>
      </div>

      {/* Button to download ID card */}
      <button onClick={handleDownloadPDF}>Download Card In PDF</button>
    </div>
  );
};

export default Form;
