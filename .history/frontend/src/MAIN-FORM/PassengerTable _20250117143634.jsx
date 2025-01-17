import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas"; // Ensure you have installed html2canvas
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

  const handleDownloadPDF = async (passenger) => {
    const idCardElement = document.getElementById(`id-card-${passenger._id}`);

    if (!idCardElement) {
      alert("ID card element not found.");
      return;
    }

    // Generate the PDF for the selected passenger
    try {
      const canvas = await html2canvas(idCardElement, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const cardWidth = pdfWidth * 0.8; // Scale to fit the page
      const cardHeight = (canvas.height / canvas.width) * cardWidth;

      pdf.addImage(imgData, "PNG", (pdfWidth - cardWidth) / 2, 20, cardWidth, cardHeight);
      pdf.save(`${passenger.name}_ID_Card.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download the ID card.");
    }
  };

  return (
    <div>
      <h1>Passenger Details</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {passengers.length > 0 ? (
        <div>
          {passengers.map((passenger) => (
            <div key={passenger._id} style={{ marginBottom: "20px" }}>
              {/* Display the ID card */}
              <div
                id={`id-card-${passenger._id}`}
                className="id-card-table"
                style={{
                  border: "1px solid #000",
                  padding: "10px",
                  width: "300px",
                  backgroundColor: "#fff",
                  position: "relative",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                  <h3 style={{ margin: 0 }}>श्री खाटू श्याम सेवादार समिति</h3>
                  <p style={{ fontSize: "12px", margin: 0 }}>
                    ए बी-468, द्वितीय तल, निर्माण नगर, जयपुर
                  </p>
                </div>
                <img
                  src={passenger.image || "./default-profile.png"} // Fallback image
                  alt="Profile"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    display: "block",
                    margin: "10px auto",
                  }}
                />
                <p>रजिस्ट्रेशन नं.: {passenger.registrationNumber}</p>
                <p>नाम: {passenger.name}</p>
                <p>पिता का नाम: {passenger.fatherName}</p>
                <p>मोबाइल नं.: {passenger.phoneNumber}</p>
                <p>पता: {passenger.address}</p>
              </div>

              {/* Download Button */}
              <button onClick={() => handleDownloadPDF(passenger)} style={{ marginTop: "10px" }}>
                Download ID Card
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No passengers available.</p>
      )}
    </div>
  );
};

export default PassengerTable;
