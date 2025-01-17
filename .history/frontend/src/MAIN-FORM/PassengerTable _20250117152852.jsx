import React from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const PassengerTable = ({ formData }) => {
  // Handle PDF download for a single passenger
  const handleDownloadPDF = (passenger) => {
    const pdf = new jsPDF();
    const cardElement = document.createElement("div");
    
    // Create ID card for this passenger
    cardElement.innerHTML = `
      <div style="width: 300px; height: 200px; padding: 10px; border: 1px solid black; text-align: center;">
        <h2>Passenger ID Card</h2>
        <img src="${passenger.image}" alt="Profile" style="width: 80px; height: 80px; border-radius: 50%;" />
        <p><strong>Name:</strong> ${passenger.name}</p>
        <p><strong>Father's Name:</strong> ${passenger.fatherName}</p>
        <p><strong>Phone:</strong> ${passenger.phoneNumber}</p>
        <p><strong>Address:</strong> ${passenger.address}</p>
        <p><strong>Registration No:</strong> ${passenger.registrationNumber}</p>
      </div>
    `;

    // Use html2canvas to capture the HTML element as an image
    html2canvas(cardElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 10, 10, 180, 120); // Adjust size accordingly
      pdf.save(`${passenger.name}_ID_Card.pdf`);
    });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Father's Name</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Download PDF</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((passenger, index) => (
            <tr key={index}>
              <td>{passenger.name}</td>
              <td>{passenger.fatherName}</td>
              <td>{passenger.phoneNumber}</td>
              <td>{passenger.address}</td>
              <td>
                <button onClick={() => handleDownloadPDF(passenger)}>Download PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerTable;
