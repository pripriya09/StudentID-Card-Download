import React, { useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./App.css";

const Form = () => {
  const [passengerCount, setPassengerCount] = useState(1); // Number of passengers
  const [formData, setFormData] = useState(
    Array(6).fill({
      name: "",
      fatherName: "",
      phoneNumber: "",
      address: "",
      image: null,
      consent: false,
    })
  );
  const [previewImages, setPreviewImages] = useState(Array(6).fill(null));
  const fileInputRefs = Array.from({ length: 6 }, () => useRef(null));

  const handlePassengerCountChange = (e) => {
    const count = parseInt(e.target.value);
    setPassengerCount(count);
  };

  const handleInputChange = (index, e) => {
    const { name, value, type, checked, files } = e.target;
    const updatedData = [...formData];

    if (type === "checkbox") {
      updatedData[index][name] = checked;
    } else if (name === "image" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(",")[1];
        updatedData[index][name] = base64Image;
        const updatedPreviewImages = [...previewImages];
        updatedPreviewImages[index] = reader.result;
        setPreviewImages(updatedPreviewImages);
      };
      reader.readAsDataURL(file);
    } else {
      updatedData[index][name] = value;
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let i = 0; i < passengerCount; i++) {
      if (!formData[i].consent) {
        alert(`Passenger ${i + 1} must agree to the terms and conditions!`);
        return;
      }
    }

    try {
      const allPassengers = formData.slice(0, passengerCount);
      await Promise.all(
        allPassengers.map((passenger) =>
          axios.post("http://localhost:6009/api/students", passenger, {
            headers: { "Content-Type": "application/json" },
          })
        )
      );

      // Clear form data after submission
      setFormData(
        Array(6).fill({
          name: "",
          fatherName: "",
          phoneNumber: "",
          address: "",
          image: null,
          consent: false,
        })
      );
      setPreviewImages(Array(6).fill(null));
      fileInputRefs.forEach((ref) => ref.current && (ref.current.value = ""));
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleDownloadAllPDF = () => {
    const idCardElements = document.querySelectorAll(".student_id");

    const pdf = new jsPDF();
    const margin = 10;
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = margin;

    Array.from(idCardElements).forEach((element, index) => {
      html2canvas(element, { scale: 1 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
        const imgHeight = (canvas.height / canvas.width) * imgWidth;

        if (yPosition + imgHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.addImage(imgData, "PNG", margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + margin;

        if (index === idCardElements.length - 1) {
          pdf.save("Passenger_ID_Cards.pdf");
        }
      });
    });
  };

  return (
    <div className="App">
      <div>
        <label>Number of Passengers: </label>
        <select value={passengerCount} onChange={handlePassengerCountChange}>
          {[...Array(6).keys()].map((num) => (
            <option key={num + 1} value={num + 1}>
              {num + 1}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        {Array.from({ length: passengerCount }).map((_, index) => (
          <div key={index} className="passenger_form">
            <h3>Passenger {index + 1}</h3>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData[index].name}
              onChange={(e) => handleInputChange(index, e)}
              required
            />
            <input
              type="text"
              name="fatherName"
              placeholder="Father's Name"
              value={formData[index].fatherName}
              onChange={(e) => handleInputChange(index, e)}
              required
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData[index].phoneNumber}
              onChange={(e) => handleInputChange(index, e)}
              required
            />
            <input
              type="file"
              name="image"
              onChange={(e) => handleInputChange(index, e)}
              ref={fileInputRefs[index]}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData[index].address}
              onChange={(e) => handleInputChange(index, e)}
              required
            />
            <label>
              <input
                type="checkbox"
                name="consent"
                checked={formData[index].consent}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
              I agree to the terms and conditions
            </label>
          </div>
        ))}
        <button type="submit">Register Passengers</button>
      </form>

      <div className="id_cards">
        {formData.slice(0, passengerCount).map((data, index) => (
          <div key={index} className="student_id">
            <img
              src={
                previewImages[index] ||
                "https://via.placeholder.com/100?text=Photo"
              }
              alt="Profile"
            />
            <p>Name: {data.name || "Demo Name"}</p>
            <p>Father's Name: {data.fatherName || "Demo Father"}</p>
            <p>Phone: {data.phoneNumber || "000-000-0000"}</p>
            <p>Address: {data.address || "Demo Address"}</p>
          </div>
        ))}
      </div>

      <button onClick={handleDownloadAllPDF}>Download All ID Cards as PDF</button>
    </div>
  );
};

export default Form;
