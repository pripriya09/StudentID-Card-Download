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
    address:"",
  });
  const [studentData, setStudentData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  // const [isConsentChecked,setIsConsent]
  const fileInputRef = useRef(null);

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
        address:"",
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
              // checked={isConsentChecked}
              // onChange={handleConsentChange}
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
                 :"")
              }
              alt="Profile Photo"
            />
          </div>
          <div className="student_name">
            <ul className="student_info">
              <li className="name"></li>
            </ul>
            {studentData ? (
              <>
                <p>Name - {studentData.name}</p>
                <p>Father's Name - {studentData.fatherName}</p>
                <p>Phone Number - {studentData.phoneNumber}</p>
                <p>Address - {studentData.address}</p>
                <p>Reg. No. - {studentData.registrationNumber}</p>
              </>
            ) : (
              <>
                <p>Name - {formData.name || "John Doe"}</p>
                <p>Father's Name - {formData.fatherName || "Father Name"}</p>
                <p>Phone Number - {formData.phoneNumber || "000-000-0000"}</p>
                <p> Address -{formData.address || "Address123"}</p>
                <p>Reg. No. - Demo-12345</p>
              </>
            )}
          </div>
        </div>
        
      </div>
      <div className="download-pdf">
      <button className="id-print-btn" onClick={handleDownloadPDF}>
        Download Card in PDF
      </button>
      </div>
    </div>
  );
};

export default Form;
