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
  
    try {
      const response = await axios.post('http://localhost:6009/api/students', formData);
      const result = response.data;
      setStudentData({ ...formData, registrationNumber: result.registrationNumber });
      setFormData("")
    } catch (error) {
      console.error('Error sending data:', error);
    }
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
