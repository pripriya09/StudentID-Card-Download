import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import "./App.css";

const Form = () => {
  const [count, setCount] = useState(1);
  const [formData, setFormData] = useState(
    Array.from({ length: 1 }, () => ({
      name: "",
      fatherName: "",
      phoneNumber: "",
      address: "",
      consent: false,
      image: null,
      disease: "",
      reference: "",
    }))
  );
  const [idCardData, setIdCardData] = useState(null);
  const fileInputRefs = useRef([]);

  const handleCountChange = (e) => {
    const newCount = parseInt(e.target.value, 10) || 1;
    setCount(newCount);

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
          disease: "",
          reference: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.some((data) => !data.consent)) {
      alert("All passengers must agree to the terms and conditions.");
      return;
    }

    try {
      const formDataToSubmit = formData.map((data) => {
        const { name, fatherName, phoneNumber, address, image, consent, disease, reference } = data;
        return { name, fatherName, phoneNumber, address, image, consent, disease, reference };
      });

      const response = await axios.post("http://localhost:6009/api/students", {
        passengers: formDataToSubmit,
      });

      if (response.status === 200) {
        alert("Passengers registered successfully.");
        setIdCardData(formData);
      } else {
        alert("Failed to register passengers. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    const idCardElements = document.querySelectorAll(".student_id");

    Promise.all(
      Array.from(idCardElements).map((card) =>
        html2canvas(card, { scale: 1 }).then((canvas) => canvas.toDataURL("image/png"))
      )
    ).then((images) => {
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const cardWidth = 100;
      const cardHeight = 60;
      const margin = 10;
      const cardsPerRow = Math.floor((pdfWidth - margin) / (cardWidth + margin));
      let x = margin;
      let y = margin;

      images.forEach((imgData, index) => {
        pdf.addImage(imgData, "PNG", x, y, cardWidth, cardHeight);
        x += cardWidth + margin;
        if ((index + 1) % cardsPerRow === 0) {
          x = margin;
          y += cardHeight + margin;
          if (y + cardHeight + margin > pdfHeight) {
            pdf.addPage();
            y = margin;
          }
        }
      });
      pdf.save("Passenger_ID_Cards.pdf");
    });
  };

  return (
    <div className="maincontainer">
      <div className="App">
        <label>
          Number of Passengers:
          <input
            type="number"
            min="1"
            max="10"
            value={count}
            onChange={handleCountChange}
          />
        </label>
        <form onSubmit={handleSubmit}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Father's Name</th>
                <th>Phone Number</th>
                <th>Image</th>
                <th>Address</th>
                <th>Disease (if any)</th>
                <th>Reference</th>
                <th>Consent</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((data, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={data.name}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="fatherName"
                      placeholder="Father's Name"
                      value={data.fatherName}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={data.phoneNumber}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="file"
                      name="image"
                      onChange={(e) => handleChange(index, e)}
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={data.address}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="disease"
                      value={data.disease}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="reference"
                      value={data.reference}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      name="consent"
                      checked={data.consent}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="submit">Register Passengers</button>
        </form>
        <div className="download-pdf">
          <button className="id-print-btn" onClick={handleDownloadPDF}>
            Download Cards as PDF
          </button>
        </div>
        {idCardData &&
          idCardData.map((data, index) => (
            <div key={index} className="student_id">
              <h3>ID Card</h3>
              <p>Name: {data.name}</p>
              <p>Father's Name: {data.fatherName}</p>
              <p>Phone: {data.phoneNumber}</p>
              <p>Address: {data.address}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Form;
