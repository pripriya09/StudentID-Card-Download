import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas"; // Import html2canvas for capturing HTML elements
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
    if (!passengers || passengers.length === 0) {
      alert("No passengers available to generate ID cards.");
      return;
    }

    const pdf = new jsPDF();
    const promises = passengers.map((passenger) => {
      const idCard = document.getElementById(`id-card-${passenger._id}`);
      return html2canvas(idCard).then((canvas) => canvas.toDataURL("image/png"));
    });

    Promise.all(promises).then((images) => {
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const cardWidth = 100;
      const cardHeight = 60;
      const margin = 10;

      let x = margin;
      let y = margin;

      images.forEach((imgData, index) => {
        pdf.addImage(imgData, "PNG", x, y, cardWidth, cardHeight);

        x += cardWidth + margin;
        if (x + cardWidth + margin > pdfWidth) {
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
      <button onClick={handleDownloadPDF}>Download All ID Cards as PDF</button>
      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Registration Number</th>
            <th>Name</th>
            <th>Father Name</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        {passengers && passengers.length > 0 ? (
          <tbody>
            {passengers.map((passenger) => (
              <tr key={passenger._id}>
                <td>{passenger.registrationNumber}</td>
                <td>{passenger.name}</td>
                <td>{passenger.fatherName}</td>
                <td>{passenger.phoneNumber}</td>
                <td>{passenger.address}</td>
                <td>
                  <button onClick={() => console.log(`Edit: ${passenger._id}`)}>
                    Edit
                  </button>
                  <button onClick={() => console.log(`Delete: ${passenger._id}`)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <p>No passengers available.</p>
        )}
      </table>

      {/* Hidden ID Cards for Download */}
      <div style={{ display: "none" }}>
        {passengers.map((passenger) => (
          <div id={`id-card-${passenger._id}`} key={passenger._id} className="id-card-table">
            <table>
              <tbody>
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", fontWeight: "bold" }}>
                    श्री खाटू श्याम सेवादार समिति
                  </td>
                </tr>
                <tr>
                  <td>रजिस्ट्रेशन नं.:</td>
                  <td>{passenger.registrationNumber}</td>
                </tr>
                <tr>
                  <td>पदयात्री का नाम:</td>
                  <td>{passenger.name}</td>
                </tr>
                <tr>
                  <td>पिता का नाम:</td>
                  <td>{passenger.fatherName}</td>
                </tr>
                <tr>
                  <td>पदयात्री मोबाइल नं.:</td>
                  <td>{passenger.phoneNumber}</td>
                </tr>
                <tr>
                  <td>पता:</td>
                  <td>{passenger.address}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassengerTable;
