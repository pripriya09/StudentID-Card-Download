import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas"; // Import html2canvas for rendering HTML to canvas
import "./App.css";

const PassengerTable = () => {
  const [passengers, setPassengers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:6009/api/students")
      .then((response) => {
        console.log("API Response:", response.data);
        setPassengers(response.data.allstudents); // Extract the array
      })
      .catch((err) => {
        setError("Failed to fetch passengers.");
        console.error(err);
      });
  }, []);

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    const idCardElements = document.querySelectorAll(".id-card");

    Promise.all(
      Array.from(idCardElements).map((card) =>
        html2canvas(card, { scale: 1 }).then((canvas) =>
          canvas.toDataURL("image/png")
        )
      )
    ).then((images) => {
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const cardWidth = 100; // ID card width in PDF
      const cardHeight = 60; // ID card height in PDF
      const margin = 5; // Spacing between cards
      const cardsPerRow = Math.floor((pdfWidth - margin) / (cardWidth + margin));
      let x = margin;
      let y = margin;

      images.forEach((imgData, index) => {
        pdf.addImage(imgData, "PNG", x, y, cardWidth, cardHeight);
        x += cardWidth + margin;

        if ((index + 1) % cardsPerRow === 0) {
          x = margin;
          y += cardHeight + margin;

          if (y + cardHeight + margin > pdfHeight) {
            pdf.addPage();
            y = margin;
          }
        }
      });
      pdf.save("Passenger_ID_Cards.pdf");
    });
  };

  return (
    <div>
      <h1>Passenger Details</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Registration Number</th>
            <th>Name</th>
            <th>Father Name</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Disease</th>
            <th>Reference</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {passengers.length > 0 ? (
            passengers.map((passenger) => (
              <React.Fragment key={passenger._id}>
                <tr>
                  <td>{passenger.registrationNumber}</td>
                  <td>{passenger.name}</td>
                  <td>{passenger.fatherName}</td>
                  <td>{passenger.phoneNumber}</td>
                  <td>{passenger.address}</td>
                  <td>{passenger.disease}</td>
                  <td>{passenger.reference}</td>
                  <td>
                    <button onClick={() => alert("Edit feature to be implemented")}>
                      Edit
                    </button>
                    <button onClick={() => alert("Cancel feature to be implemented")}>
                      Cancel
                    </button>
                  </td>
                </tr>
                <tr>
                  <td colSpan="8">
                    <div className="id-card" style={{ border: "1px solid #000", padding: "10px", margin: "10px" }}>
                      <h3>Passenger ID Card</h3>
                      <p>
                        <strong>Registration Number:</strong>{" "}
                        {passenger.registrationNumber}
                      </p>
                      <p>
                        <strong>Name:</strong> {passenger.name}
                      </p>
                      <p>
                        <strong>Father Name:</strong> {passenger.fatherName}
                      </p>
                      <p>
                        <strong>Phone:</strong> {passenger.phoneNumber}
                      </p>
                      <p>
                        <strong>Address:</strong> {passenger.address}
                      </p>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="8">No passengers available.</td>
            </tr>
          )}
        </tbody>
      </table>
      {passengers.length > 0 && (
        <button onClick={handleDownloadPDF} style={{ marginTop: "20px" }}>
          Download All ID Cards as PDF
        </button>
      )}
    </div>
  );
};

export default PassengerTable;
