import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const PassengerTable = () => {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all students when the component mounts
    const fetchPassengers = async () => {
      try {
        const response = await axios.get('http://localhost:6009/api/students');
        setPassengers(response.data.allstudents);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch passengers');
        setLoading(false);
      }
    };

    fetchPassengers();
  }, []);

  // Function to generate the PDF
  const generatePDF = (passenger) => {
    const doc = new jsPDF();

    // Add student details to the PDF
    doc.setFontSize(12);
    doc.text(`Name: ${passenger.name}`, 20, 20);
    doc.text(`Father's Name: ${passenger.fatherName}`, 20, 30);
    doc.text(`Phone Number: ${passenger.phoneNumber}`, 20, 40);
    doc.text(`Address: ${passenger.address}`, 20, 50);
    doc.text(`Disease: ${passenger.disease}`, 20, 60);
    doc.text(`Reference: ${passenger.reference}`, 20, 70);
    doc.text(`Registration Number: ${passenger.registrationNumber}`, 20, 80);

    // Add the image to the PDF (if available)
    if (passenger.image) {
      const img = new Image();
      img.src = passenger.image; // This is the base64 image string
      img.onload = () => {
        doc.addImage(img, 'JPEG', 20, 90, 50, 50); // Adjust the size and position of the image as needed
        doc.save(`${passenger.registrationNumber}.pdf`); // Save the PDF with the student's registration number as the file name
      };
    } else {
      doc.save(`${passenger.registrationNumber}.pdf`); // Save the PDF without an image
    }
  };

  // Check for loading or error
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Passenger Details</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Father's Name</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Disease</th>
            <th>Reference</th>
            <th>Image</th>
            <th>Registration Number</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((passenger) => (
            <tr key={passenger.registrationNumber}>
              <td>{passenger.name}</td>
              <td>{passenger.fatherName}</td>
              <td>{passenger.phoneNumber}</td>
              <td>{passenger.address}</td>
              <td>{passenger.disease}</td>
              <td>{passenger.reference}</td>
              <td>
                <img
                  src={passenger.image}
                  alt={passenger.name}
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              </td>
              <td>{passenger.registrationNumber}</td>
              <td>
                <button onClick={() => generatePDF(passenger)}>
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerTable;
