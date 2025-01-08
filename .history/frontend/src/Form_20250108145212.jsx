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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate a successful response and update studentData
    setStudentData(formData); // Assuming response contains this data
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();

    // Loop through each passenger and add their ID card to the PDF
    for (let i = 0; i < passengerCount; i++) {
      const idCardElement = document.querySelector(`.student_id_${i}`); // Assuming each ID card has a unique class

      if (idCardElement) {
        html2canvas(idCardElement, { scale: 1 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");

          // Add image to the PDF
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const aspectRatio = imgWidth / imgHeight;
          const adjustedWidth = 210; // PDF width (A4 size)
          const adjustedHeight = adjustedWidth / aspectRatio;

          // Add the image to the PDF (new page for each ID card)
          if (i > 0) {
            pdf.addPage();
          }

          pdf.addImage(imgData, "PNG", 10, 10, adjustedWidth, adjustedHeight);
        });
      }
    }

    // Save the PDF
    const fileName = "ID_Cards.pdf";
    pdf.save(fileName);
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

      {/* Display ID card if data is available */}
      {studentData && (
        <div className="student_id student_id_0">
          <div className="top_section">
            <div className="profile_photo">
              <img
                src={previewImage || (studentData ? `data:image/png;base64,${studentData.image}` : '')}
                alt="Profile"
              />
            </div>
            <div className="student_name">
              <ul className="student_info">
                <li className="name"></li>
              </ul>
              <p>Name: {studentData.name}</p>
              <p>Father's Name: {studentData.fatherName}</p>
              <p>Phone Number: {studentData.phoneNumber}</p>
              <p>Address: {studentData.address}</p>
              <p>Reg. No: {studentData.registrationNumber}</p>
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
