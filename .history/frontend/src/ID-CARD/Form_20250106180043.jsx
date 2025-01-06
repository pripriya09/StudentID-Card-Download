import React, { useState } from "react";
import axios from "axios";

function Form({setStudentData) {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    phoneNumber: "",
  });
  const [registrationNumber, setRegistrationNumber] = useState("");
 

  // Submit the form to register a new student
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send form data to backend
      const response = await axios.post("http://localhost:6009/api/students", formData);
      const result = response.data;

      // Update the student data with the registration number
      setStudentData({
        ...formData,
        registrationNumber: result.registrationNumber,
      });
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  // Handle changes to form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle registration number search
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      // Fetch student details by registration number
      const response = await axios.get(`http://localhost:6009/api/students/${registrationNumber}`);
      const result = response.data;
      
      // Update the student data with the fetched details
      if (result) {
        setStudentData(result);
      } else {
        alert("Student not found!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h2>Student Registration</h2>

      {/* Registration Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="fatherName"
          placeholder="Father's Name"
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>

      {/* Search by Registration Number */}
      <h2>Search by Registration Number</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter Registration Number"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {/* Display the student ID card after registration or search */}
      {studentData && (
        <div>
          <h3>ID Card</h3>
          <p>Name: {studentData.name}</p>
          <p>Father's Name: {studentData.fatherName}</p>
          <p>Phone Number: {studentData.phoneNumber}</p>
          <p>Registration Number: {studentData.registrationNumber}</p>
        </div>
      )}
    </div>
  );
};

export default Form;
