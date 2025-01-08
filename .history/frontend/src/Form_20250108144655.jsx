import React, { useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./App.css";

const Form = () => {
  const [passengers, setPassengers] = useState(1);
  const [formDataArray, setFormDataArray] = useState([
    { name: "", fatherName: "", phoneNumber: "", image: null, address: "" },
  ]);

  const fileInputRefs = useRef([]);

  const handlePassengersChange = (e) => {
    const passengerCount = parseInt(e.target.value, 10);
    setPassengers(passengerCount);

    // Adjust formDataArray size based on selected passengers
    const updatedFormDataArray = [...formDataArray];
    while (updatedFormDataArray.length < passengerCount) {
      updatedFormDataArray.push({
        name: "",
        fatherName: "",
        phoneNumber: "",
        image: null,
        address: "",
      });
    }
    setFormDataArray(updatedFormDataArray.slice(0, passengerCount));
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    // Handle file upload for image fields
    if (name === "image") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(",")[1];
        const updatedData = [...formDataArray];
        updatedData[index][name] = base64Image;
        setFormDataArray(updatedData);
      };
      reader.readAsDataURL(file);
    } else {
      const updatedData = [...formDataArray];
      updatedData[index][name] = value;
      setFormDataArray(updatedData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post data for all passengers
      for (const formData of formDataArray) {
        const response = await axios.post("http://localhost:6009/api/students", formData, {
          headers: { "Content-Type": "application/json" },
        });

        // Reset form after successful submission
        setFormDataArray(
          formDataArray.map(() => ({
            name: "",
            fatherName: "",
            phoneNumber: "",
            image: null,
            address: "",
          }))
        );
        fileInputRefs.current.forEach((ref) => ref && (ref.value = ""));
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label htmlFor="passengers">Passengers:</label>
        <select
          id="passengers"
          value={passengers}
          onChange={handlePassengersChange}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        {formDataArray.map((formData, index) => (
          <div key={index} className="passenger-form">
            <h3>Passenger {index + 1}</h3>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleChange(e, index)}
              required
            />
            <input
              type="text"
              name="fatherName"
              placeholder="Father's Name"
              value={formData.fatherName}
              onChange={(e) => handleChange(e, index)}
              required
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleChange(e, index)}
              required
            />
            <input
              type="file"
              name="image"
              onChange={(e) => handleChange(e, index)}
              required
              ref={(ref) => (fileInputRefs.current[index] = ref)}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => handleChange(e, index)}
              required
            />
          </div>
        ))}

        <button type="submit">Register All Passengers</button>
      </form>
    </div>
  );
};

export default Form;
