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
  const [isConsentChecked, setIsConsentChecked] = useState(false); // Initialize consent state
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConsentChecked) {
      alert("You must agree to the terms and conditions.");
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

  const handleConsentChange = (e) => {
    setIsConsentChecked(e.target.checked);
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
          placeholder="Address"
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
                  : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAM1BMVEUKME7///+El6bw8vQZPVlHZHpmfpHCy9Ojsbzg5ekpSmTR2N44V29XcYayvsd2i5yTpLFbvRYnAAAJcklEQVR4nO2d17arOgxFs+kkofz/154Qmg0uKsuQccddT/vhnOCJLclFMo+//4gedzcApf9B4srrusk+GsqPpj+ypq7zVE9LAdLWWVU+Hx69y2FMwAMGyfusLHwIpooyw9IAQfK+8naDp3OGHvZ0FMhrfPMgVnVjC2kABOQ1MLvi0DEIFj1ILu0LU2WjNRgtSF3pKb4qqtd9IHmjGlJHlc09IHlGcrQcPeUjTAySAGNSkQlRhCCJMGaUC0HSYUx6SmxFAtJDTdylsr4ApC1TY0yquKbCBkk7qnYVzPHFBHkBojhVJWviwgPJrsP4qBgTgbQXdsesjm4pDJDmIuswVZDdFx0ENTtkihoeqSDXD6tVxOFFBHndMKxWvUnzexpIcx/Gg2goJJDhVo6PCMGRAnKTmZuKm3wcJO/upphUqUHy29yVrRhJDORXOKIkEZDf4YiRhEF+iSNCEgb5KY4wSRDkB/yurUEG8nMcocgYABnvbrVL3nMIP0h/d5udKnwzSC/InfPdkJ6eWb0PJE++dyVVyQP5iQmWW27X5QG5druEKafBu0Hqu9saVOHa8HKC/K6BzHKZiRMEZCDF0Nd1/ZfXI/fcOibHOssFgokg9uFA20BhztHEAZIjIohrD/o1wljeFBDEwBo8YUt5Ir/rNLjOIACPFdy/AbEcPdcJBOCxytjeYAM4Kzp6rhOIPhRGNzwmFP3rOoTFI0irtnQKx6fj1Zt+h9njEUS9mKJxfFRrX5lt7wcQtaWTOfTHeIXVJQcQrRW+OYex2j0a66XZINoO8a7fPH2iHF2mC7ZBtB3Czb5QvjizSx7A3308mRzqAwujSywQbYfwc0iU8zqjS0yQ6ztEHX9332KCaGNIYB/Qq1z3yN0oDZBWyeFYJBCkm2sXLhDtpKFwNDMu5TnrZpYGiHbK4Nlwikg5DrYV1g6iPoJmzE5MKd/fOp53EPUaQZaLqH3u+vo2ELWp3wSyWuYGoj9EEIJoV3L9AUS/ZLsJpLNBXmqOu0CW6P5A/dx9IL0FAji/FYKot9EqE0Tvs6QBUe/2CxMEkZAlBNGPhdoAQWyTSmbxUwvUygwQyMmniAPgLt87CODXHuftWJIQgzrfQDC5AfwSgz9MmmG/gWCOqDgZ4JsQeTvZBoJJDhAFEsSDyxUEEUUekk0UEMhjBcEcGsoWVpBU3NcCgkkPkJWrKbdRZvULCwHpPH9WZ5Jg9P4fWkglgYP2HHrNTjseZ2AYyD4GnXCB3jlPwhIxp4wMRWg5POmnf2u84O8fNJyoM4xM0vWe+1BGAU8XlONw=="}
              alt="Profile"
              style={{ maxWidth: "150px", maxHeight: "150px" }}
            />
          </div>
          <div className="student_name">
            <span className="name">{studentData?.name}</span>
            <span className="father_name">{studentData?.fatherName}</span>
          </div>
        </div>

        <div className="bottom_section">
          <div className="student_info">
            <div className="phone_number">Phone: {studentData?.phoneNumber}</div>
            <div className="address">Address: {studentData?.address}</div>
            <div className="registration_number">
              Reg. No: {studentData?.registrationNumber}
            </div>
          </div>
        </div>
      </div>
      <button onClick={handleDownloadPDF}>Download PDF</button>
    </div>
  );
};

export default Form;
