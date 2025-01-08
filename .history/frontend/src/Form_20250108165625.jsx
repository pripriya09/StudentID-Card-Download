import React, { useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./App.css";

const Form = () => {
  const [passengers, setPassengers] = useState([]);
  const [passengerCount, setPassengerCount] = useState(1);
  const fileInputRefs = useRef([]);

  const handlePassengerCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setPassengerCount(count);

    const newPassengers = Array.from({ length: count }, (_, i) => {
      return passengers[i] || {
        name: "",
        fatherName: "",
        phoneNumber: "",
        image: null,
        address: "",
        consent: false,
      };
    });
    setPassengers(newPassengers);
  };

  const handlePassengerChange = (index, e) => {
    const { name, value, type, checked } = e.target;

    setPassengers((prevPassengers) => {
      const updatedPassengers = [...prevPassengers];
      if (type === "checkbox") {
        updatedPassengers[index][name] = checked;
      } else if (name === "image") {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result.split(",")[1];
          updatedPassengers[index][name] = base64Image;
          setPassengers([...updatedPassengers]);
        };
        reader.readAsDataURL(file);
      } else {
        updatedPassengers[index][name] = value;
      }
      return updatedPassengers;
    });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    passengers.forEach((passenger, index) => {
      const idCardElement = document.querySelector(`#passenger-${index}`);
      if (idCardElement) {
        html2canvas(idCardElement).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfHeight = doc.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const width = imgWidth * ratio;
          const height = imgHeight * ratio;
          const x = (pdfWidth - width) / 2;
          const y = 10;
          doc.addImage(imgData, "PNG", x, y, width, height);
          if (index < passengers.length - 1) doc.addPage();
        });
      }
    });
    doc.save("passenger_id_cards.pdf");
  };

  return (
    <div className="App">
      <div>
        <label>
          Number of Passengers:{" "}
          <input
            type="number"
            min="1"
            max="6"
            value={passengerCount}
            onChange={handlePassengerCountChange}
          />
        </label>
      </div>
      <form>
        {passengers.map((passenger, index) => (
          <div key={index} className="passenger-form">
            <h3>Passenger {index + 1}</h3>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={passenger.name}
              onChange={(e) => handlePassengerChange(index, e)}
              required
            />
            <input
              type="text"
              name="fatherName"
              placeholder="Father's Name"
              value={passenger.fatherName}
              onChange={(e) => handlePassengerChange(index, e)}
              required
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={passenger.phoneNumber}
              onChange={(e) => handlePassengerChange(index, e)}
              required
            />
            <input
              type="file"
              name="image"
              onChange={(e) => handlePassengerChange(index, e)}
              ref={(el) => (fileInputRefs.current[index] = el)}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={passenger.address}
              onChange={(e) => handlePassengerChange(index, e)}
              required
            />
            <label>
              <input
                type="checkbox"
                name="consent"
                checked={passenger.consent}
                onChange={(e) => handlePassengerChange(index, e)}
                required
              />
              I agree to the terms and conditions.
            </label>
          </div>
        ))}
      </form>
      <div>
        {passengers.map((passenger, index) => (
          <div key={index} id={`passenger-${index}`} className="student_id">
            <h3>ID Card for Passenger {index + 1}</h3>
            <img
              src={
                passenger.image
                  ? `data:image/png;base64,${passenger.image}`
                  : "placeholder-image-url"
              }
              alt="Profile"
            />
            <p>Name: {passenger.name || "N/A"}</p>
            <p>Father's Name: {passenger.fatherName || "N/A"}</p>
            <p>Phone Number: {passenger.phoneNumber || "N/A"}</p>
            <p>Address: {passenger.address || "N/A"}</p>
          </div>
        ))}
      </div>
      <button type="button" onClick={handleDownloadPDF}>
        Download All ID Cards as PDF
      </button>
    </div>
  );
};

export default Form;
