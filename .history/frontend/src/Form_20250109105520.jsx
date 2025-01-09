import React, { useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas"; // Import html2canvas
import "./App.css";

const Form = () => {
  const [count, setCount] = useState(1); // Number of ID cardsc
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    phoneNumber: "",
    image: null,
    address:"",
    consent: false, // Added consent field
  });
  const [studentData, setStudentData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  // const [isConsentChecked,setIsConsent]
  const fileInputRef = useRef(null);


  const handleCountChange = (e) => {
    const newCount = parseInt(e.target.value, 10) || 1;
    setCount(newCount);

    // Adjust the number of form data objects
    const updatedFormDataList = [...formDataList];
    while (updatedFormDataList.length < newCount) {
      updatedFormDataList.push({
        name: "",
        fatherName: "",
        phoneNumber: "",
        image: null,
        address: "",
        consent: false,
      });
    }
    setFormData(updatedFormDataList.slice(0, newCount));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert("You must agree to the terms and conditions!");
      return;
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
        address:"",
        consent: false,
      });
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedFormDataList = [...formDataL];

    if (type === "checkbox") {
      updatedFormDataList[index][name] = checked;
    } else if (name === "image") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(",")[1];
        updatedFormDataList[index][name] = base64Image;
      };
      reader.readAsDataURL(file);
    } else {
      updatedFormDataList[index][name] = value;
    }

    setFormData(updatedFormDataList);
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
      <div>
        <label>
          Select Number of ID Cards:
          <input
            type="number"
            min="1"
            max="6"
            // value={count}
            // onChange={handleCountChange}
          />
        </label>
      </div>
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
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
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
                  : "data:image/png;base64,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")
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
