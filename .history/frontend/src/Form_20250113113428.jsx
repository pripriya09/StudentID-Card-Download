import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import "./App.css";

const Form = () => {
  const [count, setCount] = useState(1); // Number of passengers
  const [disease, setDisease] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [referenceMobile, setReferenceMobile] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all passengers have agreed to terms
    if (formData.some((data) => !data.consent)) {
      alert("All passengers must agree to the terms and conditions.");
      return;
    }

    try {
      const formDataToSubmit = {
        passengers: formData.map((data) => ({
          ...data, // Passenger details
        })),
        disease,
        reference: {
          name: referenceName,
          mobile: referenceMobile,
        },
      };

      const response = await axios.post("http://localhost:6009/api/students", formDataToSubmit);

      if (response.status === 200) {
        alert("Passengers registered successfully.");
        console.log("Response Data:", response.data);

        // If the backend provides registration numbers, update the state
        setFormData((prevData) =>
          prevData.map((data, index) => ({
            ...data,
            registrationNumber: response.data.registrationNumbers[index],
          }))
        );
      } else {
        alert("Failed to register passengers. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
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
        <label>
          Any kind of disease, if yes then give details:
          <input
            type="text"
            placeholder="Your Disease Details / Your Answers"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
          />
        </label>
        <label>
          Reference Name:
          <input
            type="text"
            placeholder="Reference Name"
            value={referenceName}
            onChange={(e) => setReferenceName(e.target.value)}
            required
          />
        </label>
        <label>
          Reference Mobile Number:
          <input
            type="tel"
            placeholder="Reference Mobile Number"
            value={referenceMobile}
            onChange={(e) => setReferenceMobile(e.target.value)}
            required
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
      </div>
    </div>
  );
};

export default Form;
