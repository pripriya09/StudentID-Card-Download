import React, { useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./App.css";

const Form = () => {
  const [count, setCount] = useState(1); // Number of ID cards
  const [formDataList, setFormDataList] = useState([
    {
      name: "",
      fatherName: "",
      phoneNumber: "",
      image: null,
      address: "",
      consent: false,
    },
  ]);
  const [studentDataList, setStudentDataList] = useState([]);
  const fileInputRefs = useRef([]);

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
    setFormDataList(updatedFormDataList.slice(0, newCount));
  };

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedFormDataList = [...formDataList];

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

    setFormDataList(updatedFormDataList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentDataResponses = [];

    for (const data of formDataList) {
      if (!data.consent) {
        alert("You must agree to the terms and conditions!");
        return;
      }

      try {
        const response = await axios.post("http://localhost:6009/api/students", data, {
          headers: { "Content-Type": "application/json" },
        });

        const registrationNumber = response.data.registrationNumber;
        const studentResponse = await axios.get(`http://localhost:6009/api/students/${registrationNumber}`);
        studentDataResponses.push(studentResponse.data);
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    }

    setStudentDataList(studentDataResponses);
  };

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF();

    for (const [index, studentData] of studentDataList.entries()) {
      const idCardElement = document.querySelector(`#id-card-${index}`);
      if (idCardElement) {
        const canvas = await html2canvas(idCardElement, { scale: 1 });
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        if (index < studentDataList.length - 1) {
          pdf.addPage(); // Add a new page for the next ID card
        }
      }
    }

    pdf.save("ID_Cards.pdf");
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
            value={count}
            onChange={handleCountChange}
          />
        </label>
      </div>
      <form onSubmit={handleSubmit}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="form-section">
            <h3>ID Card {index + 1}</h3>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formDataList[index]?.name || ""}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <input
              type="text"
              name="fatherName"
              placeholder="Father's Name"
              value={formDataList[index]?.fatherName || ""}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formDataList[index]?.phoneNumber || ""}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <input
              type="file"
              name="image"
              onChange={(e) => handleChange(index, e)}
              ref={(el) => (fileInputRefs.current[index] = el)}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formDataList[index]?.address || ""}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <label>
              <input
                type="checkbox"
                name="consent"
                checked={formDataList[index]?.consent || false}
                onChange={(e) => handleChange(index, e)}
                required
              />
              I agree to the terms and conditions.
            </label>
          </div>
        ))}
        <button type="submit">Register</button>
      </form>

      <div>
        {studentDataList.map((studentData, index) => (
          <div key={index} id={`id-card-${index}`} className="student_id">
            <p>Name: {studentData.name}</p>
            <p>Father's Name: {studentData.fatherName}</p>
            <p>Phone Number: {studentData.phoneNumber}</p>
            <p>Address: {studentData.address}</p>
            <p>Reg. No.: {studentData.registrationNumber}</p>
          </div>
        ))}
      </div>

      {studentDataList.length > 0 && (
        <button onClick={handleDownloadPDF}>Download All Cards as PDF</button>
      )}
    </div>
  );
};

export default Form;
