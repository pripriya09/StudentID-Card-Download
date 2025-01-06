import React, { useState } from 'react';
import axios from "axios"

const Form = ({ setStudentData }) => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    phoneNumber: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send form data to backend
    const response = await axios('http://localhost:6009/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    setStudentData({ ...formData, registrationNumber: result.registrationNumber });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="text" name="fatherName" placeholder="Father's Name" onChange={handleChange} required />
      <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
      <button type="submit">Generate ID Card</button>
    </form>
  );
};

export default Form;
