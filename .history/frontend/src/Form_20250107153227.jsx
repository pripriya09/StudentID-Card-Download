import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

  const handleDownloadPDF = () => {
    const idCardElement = document.querySelector(".id-card");
    if (idCardElement) {
      html2canvas(idCardElement, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
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
        <input
          type="file"
          name="image"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>

      <div className="id-card" id="id-card">
        <div className="id-card-header">
          <h3>Student ID Card</h3>
        </div>
        <div className="id-card-body">
          <div className="id-card-photo">
            <img
              src={previewImage || (studentData ? studentData.image : "https://via.placeholder.com/150")}
              alt="Student"
            />
          </div>
          <div className="id-card-details">
            <p><strong>Name:</strong> {studentData ? studentData.name : formData.name || "John Doe"}</p>
            <p>
              <strong>Father's Name:</strong>{" "}
              {studentData ? studentData.fatherName : formData.fatherName || "Father Name"}
            </p>
            <p>
              <strong>Phone Number:</strong>{" "}
              {studentData ? studentData.phoneNumber : formData.phoneNumber || "000-000-0000"}
            </p>
            <p>
              <strong>Registration No:</strong>{" "}
              {studentData ? studentData.registrationNumber : "Demo-12345"}
            </p>
          </div>
        </div>
      </div>

      <button onClick={handleDownloadPDF}>Download Card in PDF</button>
    </div>
  );
};

export default Form;
