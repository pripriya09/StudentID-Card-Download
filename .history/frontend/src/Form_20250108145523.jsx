import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const IDCardApp = () => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    phoneNumber: '',
    address: '',
    registrationNumber: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image file input
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  // Submit form data and display ID card
  const handleSubmit = (e) => {
    e.preventDefault();
    setStudentData(formData); // Store the form data for ID card display
  };

  // Download all ID cards as a PDF
  const handleDownloadPDF = () => {
    const pdf = new jsPDF();

    // Loop through each passenger and add their ID card to the PDF
    for (let i = 0; i < passengerCount; i++) {
      const idCardElement = document.querySelector(`#student_id_${i}`); // Each ID card has a unique ID

      if (idCardElement) {
        html2canvas(idCardElement, { scale: 1 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");

          // Add image to the PDF (new page for each ID card)
          const imgWidth = 210; // A4 width in mm
          const aspectRatio = canvas.width / canvas.height;
          const imgHeight = imgWidth / aspectRatio;

          if (i > 0) {
            pdf.addPage();
          }

          pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        });
      }
    }

    // Save the PDF
    pdf.save("ID_Cards.pdf");
  };

  return (
    <div>
      <h1>ID Card Generator</h1>

      {/* Form for user input */}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <br />
        <label>Father's Name:</label>
        <input
          type="text"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
        />
        <br />
        <label>Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <br />
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <br />
        <label>Registration Number:</label>
        <input
          type="text"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={handleChange}
        />
        <br />
        <label>Upload Profile Image:</label>
        <input type="file" onChange={handleImageUpload} />
        <br />
        <button type="submit">Submit</button>
      </form>

      {/* Display ID card if student data is available */}
      {studentData && (
        <div id={`student_id_0`} className="student_id">
          <div className="top_section">
            <div className="profile_photo">
              <img
                src={previewImage || URL.createObjectURL(studentData.image)}
                alt="Profile"
                style={{ width: "100px", height: "100px" }}
              />
            </div>
            <div className="student_name">
              <ul className="student_info">
                <li>Name: {studentData.name}</li>
                <li>Father's Name: {studentData.fatherName}</li>
                <li>Phone: {studentData.phoneNumber}</li>
                <li>Address: {studentData.address}</li>
                <li>Registration No: {studentData.registrationNumber}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Button to download PDF */}
      {studentData && (
        <button onClick={handleDownloadPDF}>Download All ID Cards as PDF</button>
      )}
    </div>
  );
};

export default IDCardApp;
