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
  const generatePDF = (data) => {
    const doc = new jsPDF('p', 'mm', 'a4');  // Set to A4 size for a typical card layout
  
    // Set the width and height of the card
    const cardWidth = 190; // Adjust width of the card (in mm)
    const cardHeight = 100; // Adjust height of the card (in mm)
    
    // Add card border and background
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.rect(10, 10, cardWidth, cardHeight); // Draw the border
  
    // Set the first row (श्री खाटू श्याम देवाय नमः)
    doc.setTextColor('red');
    doc.setFontSize(8);
    doc.text('॥ श्री खाटू श्याम देवाय नमः ॥', 15, 18);
  
    // Set the registration number (right-aligned)
    doc.setTextColor('rgb(0, 0, 206)');
    doc.text('रजि. नं. : COOPI2024 / JAIPURI206591', cardWidth - 60, 18);
  
    // Title of the committee (centered)
    doc.setTextColor('rgb(255, 0, 0)');
    doc.setFontSize(16);
    doc.text('श्री खाटू श्याम सेवादार समिति', cardWidth / 2, 30, { align: 'center' });
  
    // Address row (centered)
    doc.setTextColor('rgb(0, 0, 0)');
    doc.setFontSize(10);
    doc.text('ए बी 468, दूसरी मंजिल, निर्माण नगर, किंग्स रोड़, अजमेर रोड़, जयपुर मो- 8905902495', cardWidth / 2, 38, { align: 'center' });
  
    // Event row (centered)
    doc.setTextColor('rgb(255, 0, 43)');
    doc.setFontSize(12);
    doc.text('रींगस से खाटूधाम पदयात्रा (दिनांक- 13 फरवरी 2025)', cardWidth / 2, 46, { align: 'center' });
  
    // Add the image (profile picture)
    if (data.image) {
      const img = new Image();
      img.src = data.image;
      img.onload = () => {
        doc.addImage(img, 'JPEG', 10, 50, 40, 40);  // Adjust position and size of the image
        addTextFields();
        doc.save(`${data.registrationNumber}.pdf`);
      };
    } else {
      addTextFields();
      doc.save(`${data.registrationNumber}.pdf`);
    }
  
    // Function to add text fields after the image is added
    const addTextFields = () => {
      // Add Registration Number
      doc.setTextColor('rgb(0, 0, 0)');
      doc.setFontSize(10);
      doc.text(`रजिस्ट्रेशन नं. - ${data.registrationNumber}`, 70, 60);
  
      // Add Name
      doc.text(`पद्याती का नाम - ${data.name}`, 70, 70);
  
      // Add Father's Name
      doc.text(`पिता का नाम - ${data.fatherName}`, 70, 80);
  
      // Add Phone Number
      doc.text(`पदयात्री मोबाइल नं. - ${data.phoneNumber}`, 70, 90);
  
      // Add Address
      doc.text(`पदयात्री का पता - ${data.address}`, 70, 100);
  
      // Add Contact Info (bottom section)
      doc.setTextColor('rgb(12, 0, 177)');
      doc.setFontSize(10);
      doc.text('सम्पर्क सूत्र : 8696555530, 9887662860, 9828156963, 6376999432, 9314476414, 9828256321, 9782676365', cardWidth / 2, cardHeight - 10, { align: 'center' });
    };
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
          {passengers.map((passenger, index) => (
            <tr key={index}>
              <td>{passenger.name}</td>
              <td>{passenger.fatherName}</td>
              <td>{passenger.phoneNumber}</td>
              <td>{passenger.address}</td>
              <td>{passenger.disease}</td>
              <td>{passenger.reference}</td>
              <td>
                <img
                  src={passenger.image || './shyam.jpg'}
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
