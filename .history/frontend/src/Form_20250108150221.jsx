import React, { useState, useRef } from "react";
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
    address: "",
  });
  const [studentData, setStudentData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isConsentChecked, setIsConsentChecked] = useState(false); // State for consent checkbox
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConsentChecked) {
      alert("You must agree to the terms and conditions.");
      return; // Stop form submission if consent is not checked
    }
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
        address: "",
      });
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input
      }
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

  const handleDownloadPDF = () => {
    const idCardElement = document.querySelector(".student_id");

    if (idCardElement) {
      html2canvas(idCardElement, { scale: 1 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png"); // Convert canvas to image data

        const pdf = new jsPDF();

        // Define fixed width and height for the ID card in the PDF
        const fixedWidth = 50; // Set a fixed width for the ID card
        const fixedHeight = 50; // Set a fixed height for the ID card

        // Calculate aspect ratio to adjust the image's dimensions proportionally
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const aspectRatio = imgWidth / imgHeight;
        const adjustedWidth = fixedHeight * aspectRatio;

        // Get PDF page width and height
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate X and Y to center the image
        const x = (pdfWidth - adjustedWidth) / 2;
        const y = (pdfHeight - fixedHeight) / 2;

        // Add the image to the PDF, positioned at the calculated coordinates
        pdf.addImage(imgData, "PNG", x, y, adjustedWidth, fixedHeight);
        const fileName = `${studentData.registrationNumber}_ID_Card.pdf`;
        pdf.save(fileName);
        setStudentData(null); // Clear student data
        setPreviewImage(null); // Clear the preview image
      });
    } else {
      alert("ID card not found!");
    }
  };

  const handleConsentChange = () => {
    setIsConsentChecked(!isConsentChecked); // Toggle the consent checkbox value
  };

  return (
    <div className="App">
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
          ref={fileInputRef}
        />
        
        <input
          type="text"
          name="address"
          placeholder="address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <div className="consent">
          <label>
            <input
              type="checkbox"
              checked={isConsentChecked}
              onChange={handleConsentChange}
              required
            />
            I agree to the terms and conditions for creating the ID card
          </label>
        </div>
        <button type="submit">Register</button>
      </form>

      {/* -----------------------------------------------------------display------------------code------- */}
      <div className="student_id">
        <div className="top_section">
          <div className="profile_photo">
            <img
              src={
                previewImage ||
                (studentData
                  ? studentData.image
                  : "data:image/png;base64,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"}
              alt="Profile"
            />
          </div>
          <div className="student_details">
            <h3>{studentData ? studentData.name : ""}</h3>
            <p>Registration Number: {studentData ? studentData.registrationNumber : ""}</p>
            <p>Father's Name: {studentData ? studentData.fatherName : ""}</p>
            <p>Phone Number: {studentData ? studentData.phoneNumber : ""}</p>
            <p>Address: {studentData ? studentData.address : ""}</p>
          </div>
        </div>
      </div>

      <button onClick={handleDownloadPDF}>Download PDF</button>
    </div>
  );
};

export default Form;
