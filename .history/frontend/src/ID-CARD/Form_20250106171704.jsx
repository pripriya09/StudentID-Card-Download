import React, { useState } from 'react';
import axios from 'axios';

const Form = ({ setStudentData }) => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    phoneNumber: '',
  });

  // Submit form data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send form data to backend
    try {
      const response = await axios.post('http://localhost:6009/api/students', formData);

      // Set student data with registration number
      setStudentData({ ...formData, registrationNumber: response.data.registrationNumber });

      // Optionally, handle the response (e.g., show success message)
      alert('Student ID card generated! Registration Number: ' + response.data.registrationNumber);
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error generating the ID card');
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="fatherName"
        placeholder="Father's Name"
        value={formData.fatherName}
        onChange={handleChange}
        required
      />
      <input
        type="tel"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
      />
      <button type="submit">Generate ID Card</button>
    </form>
  );
};

export default Form;
