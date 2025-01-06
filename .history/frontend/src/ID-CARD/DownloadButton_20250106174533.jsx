import React from 'react';
import jsPDF from 'jspdf';


function DownloadButton ({ studentData }) {
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text(`Student ID Card`, 10, 10);
    doc.text(`Name: ${studentData.name}`, 10, 20);
    doc.text(`Father's Name: ${studentData.fatherName}`, 10, 30);
    doc.text(`Phone: ${studentData.phoneNumber}`, 10, 40);
    doc.text(`Registration Number: ${studentData.registrationNumber}`, 10, 50);
    doc.save('Student-ID-Card.pdf');
  };

  return <button onClick={handleDownload}>Download ID Card</button>;
};

export default DownloadButton;
