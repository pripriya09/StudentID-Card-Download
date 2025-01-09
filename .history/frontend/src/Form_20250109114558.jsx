import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./App.css";

const Form = () => {
  const [count, setCount] = useState(1); // Number of passengers
  const [formData, setFormData] = useState(
    Array.from({ length: 1 }, () => ({
      name: "",
      fatherName: "",
      phoneNumber: "",
      address: "",
      consent: false,
      image: null,
    }))
  );

  const fileInputRefs = useRef([]);

  const handleCountChange = (e) => {
    const newCount = parseInt(e.target.value, 10) || 1;
    setCount(newCount);

    // Adjust form data array length
    setFormData((prevData) => {
      const updatedFormData = [...prevData];
      while (updatedFormData.length < newCount) {
        updatedFormData.push({
          name: "",
          fatherName: "",
          phoneNumber: "",
          address: "",
          consent: false,
          image: null,
        });
      }
      return updatedFormData.slice(0, newCount);
    });
  };

  const handleChange = (index, e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => {
      const updatedData = [...prevData];
      if (type === "checkbox") {
        updatedData[index][name] = checked;
      } else if (type === "file") {
        const reader = new FileReader();
        reader.onloadend = () => {
          updatedData[index][name] = reader.result;
          setFormData(updatedData);
        };
        if (files[0]) reader.readAsDataURL(files[0]);
      } else {
        updatedData[index][name] = value;
      }
      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.some((data) => !data.consent)) {
      alert("All passengers must agree to the terms and conditions.");
      return;
    }
    console.log("Submitted Data:", formData);
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    const idCardElements = document.querySelectorAll(".id-card");

    Promise.all(
      Array.from(idCardElements).map((card) =>
        html2canvas(card).then((canvas) => canvas.toDataURL("image/png"))
      )
    ).then((images) => {
      images.forEach((imgData, index) => {
        if (index > 0) pdf.addPage();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight - 20);
      });
      pdf.save("Passenger_ID_Cards.pdf");
    });
  };

  return (
    <div className="App">
      <label>
        Number of Passengers:
        <input
          type="number"
          min="1"
          max="6"
          value={count}
          onChange={handleCountChange}
        />
      </label>
      <form onSubmit={handleSubmit}>
        {formData.map((data, index) => (
          <div key={index} className="form-section">
            <h3>Passenger {index + 1}</h3>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={data.name}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <input
              type="text"
              name="fatherName"
              placeholder="Father's Name"
              value={data.fatherName}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={data.phoneNumber}
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
              value={data.address}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <label>
              <input
                type="checkbox"
                name="consent"
                checked={data.consent}
                onChange={(e) => handleChange(index, e)}
                required
              />
              I agree to the terms and conditions.
            </label>
          </div>
        ))}
        <button type="submit">Register Passengers</button>
      </form>
      <button onClick={handleDownloadPDF}>Download All ID Cards as PDF</button>
      <div className="id-cards">
        {formData.map((data, index) => (
          <div key={index} className="id-card">
            <h3>ID Card {index + 1}</h3>
            <img
              src={data.image || "https://via.placeholder.com/100"}
              alt={`Passenger ${index + 1}`}
            />
            <p>Name: {data.name}</p>
            <p>Father's Name: {data.fatherName}</p>
            <p>Phone Number: {data.phoneNumber}</p>
            <p>Address: {data.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Form;
