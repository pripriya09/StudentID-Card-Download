import React, { useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "./App.css";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    phoneNumber: "",
  });
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [userImage, setUserImage] = useState(null); // For user's uploaded image
  const canvasRef = useRef(null); // Reference to the canvas element

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:6009/api/students", formData);
      const result = response.data;

      setStudentData({
        ...formData,
        registrationNumber: result.registrationNumber,
      });

      setFormData({
        name: "",
        fatherName: "",
        phoneNumber: "",
      });
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
      setUserImage(URL.createObjectURL(file));
    }
  };

  // Draw image on canvas (base image + user image)
  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Base image (demo image)
    const baseImage = new Image();
    baseImage.src = 'https://pngimage.net/wp-content/uploads/2018/06/white-menu-icon-png-8.png'; // Demo image URL
    baseImage.onload = () => {
      // Draw base image on canvas
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // User image (uploaded by the user)
      if (userImage) {
        const userImageElement = new Image();
        userImageElement.src = userImage;

        userImageElement.onload = () => {
          // Draw user image on top with circular mask
          ctx.beginPath();
          ctx.arc(250, 250, 100, 0, Math.PI * 2); // Circular mask
          ctx.clip(); // Apply circular clipping
          ctx.drawImage(userImageElement, 150, 150, 200, 200); // Adjust position and size
          ctx.closePath();
        };
      }

      // Add text (user name)
      ctx.font = '24px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('John Doe', 200, 480); // Example name
    };
  };

  const handleDownloadCanvasImage = () => {
    const canvas = canvasRef.current;
    const imageURL = canvas.toDataURL("image/png"); // Convert canvas content to image URL

    // Create a link and trigger download
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "id_card.png"; // Download the image
    link.click();
  };

  const handleDownloadPDF = () => {
    if (studentData) {
      const PDFdocument = new jsPDF();
      const studentInfo = `
        Student ID Card
        Name: ${studentData.name}
        Father's Name: ${studentData.fatherName}
        Phone: ${studentData.phoneNumber}
        Registration Number: ${studentData.registrationNumber}
      `;
      PDFdocument.text(studentInfo, 10, 10);
      PDFdocument.save(`${studentData.registrationNumber}_ID_Card.pdf`);
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
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit">Register</button>
      </form>

      {/* Display Canvas with Generated Image */}
      <canvas
        id="profileCanvas"
        ref={canvasRef}
        width="500"
        height="500"
        style={{ display: studentData ? "block" : "none", marginTop: "20px" }}
      ></canvas>
      {studentData && (
        <div className="id-card">
          <h3>ID Card</h3>
          <p>Name: {studentData.name}</p>
          <p>Father's Name: {studentData.fatherName}</p>
          <p>Phone Number: {studentData.phoneNumber}</p>
          <p>Registration Number: {studentData.registrationNumber}</p>
          <button onClick={handleDownloadCanvasImage}>Download ID Card Image</button>
          <button onClick={handleDownloadPDF}>Download Card In PDF</button>
        </div>
      )}

      {/* Button to trigger image drawing */}
      <button onClick={drawImage} style={{ marginTop: "20px" }}>
        Generate ID Card
      </button>
    </div>
  );
};

export default Form;
