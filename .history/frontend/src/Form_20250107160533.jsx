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
      const response = await axios.post(
        "http://localhost:6009/api/students",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

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

  // Handle PDF download (including image and text as part of the card)

  const handleDownloadPDF = () => {
    const idCardElement = document.querySelector(".student_id"); // Select the id-card element

    if (idCardElement) {
      // Use html2canvas to capture the id-card as an image
      html2canvas(idCardElement, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png"); // Convert canvas to image data

        // Create a new PDF document
        const pdf = new jsPDF();

        // Calculate dimensions for the image in the PDF
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // Add the image to the PDF
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        // Save the PDF
        pdf.save("ID_Card.pdf");
      });
    } else {
      alert("ID card not found!");
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
        <input type="file" name="image" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>

      <div class="student_id">
        <div class="top_section">
          <div class="profile_photo">
            <img
              src={
                previewImage ||
                (studentData
                  ? studentData.image
                  : "https://via.placeholder.com/150")
              }
              alt="Profile Photo"
            />
          </div>
          <div class="student_name">
            <ul class="student_info">
              <li class="name">John Doe</li>
            </ul>
          </div>
        </div>

        <div class="bottom_section">
          <div class="student_details">
            {studentData ? (
              <>
                <p>Name: {studentData.name}</p>
                <p>Father's Name: {studentData.fatherName}</p>
                <p>Phone Number: {studentData.phoneNumber}</p>
                <p>Registration Number: {studentData.registrationNumber}</p>
              </>
            ) : (
              <>
                <p>Name: {formData.name || "John Doe"}</p>
                <p>Father's Name: {formData.fatherName || "Father Name"}</p>
                <p>Phone Number: {formData.phoneNumber || "000-000-0000"}</p>
                <p>Registration Number: Demo-12345</p>
              </>
            )}
          </div>
          <button onClick={handleDownloadPDF}>Download Card in PDF</button>
        </div>
      </div>
    </div>
  );
};

export default Form;
