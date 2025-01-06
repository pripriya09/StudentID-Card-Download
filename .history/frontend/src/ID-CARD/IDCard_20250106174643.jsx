import React from 'react';

const IDCard = ({ studentData }) {
  return (
    <div className="id-card">
      <h2>Student ID Card</h2>
      <p><strong>Name:</strong> {studentData.name}</p>
      <p><strong>Father's Name:</strong> {studentData.fatherName}</p>
      <p><strong>Phone:</strong> {studentData.phoneNumber}</p>
      <p><strong>Registration Number:</strong> {studentData.registrationNumber}</p>
    </div>
  );
};

export default IDCard;


