import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./App.css";

const PassengerTable = () => {
  const [passengers, setPassengers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:6009/api/students")
      .then((response) => {
        console.log("API Response:", response.data);
        setPassengers(response.data.allstudents);
      })
      .catch((err) => {
        setError("Failed to fetch passengers.");
        console.error(err);
      });
  }, []);
  const handleDownloadPDF = (passengerId) => {
    // Ensure only one download is triggered per click
    const passenger = passengers.find((p) => p._id === passengerId);
  
    if (!passenger) {
      console.error("Passenger not found!");
      return;
    }
  
    // Prevent multiple downloads by checking if the temporary card is already created
    const existingCard = document.getElementById('temporary-card');
    if (existingCard) {
      console.log('A card is already being processed, please wait.');
      return; // Prevent duplicate download if card is already being processed
    }
  
    // Create a temporary div for the ID card
    const idCard = document.createElement("div");
    idCard.id = 'temporary-card'; // Assign a unique id to avoid duplicates
    idCard.style.position = "absolute";
    idCard.style.left = "-9999px"; // Ensure it's off-screen
    idCard.style.top = "-9999px"; // Ensure it's off-screen
    idCard.style.width = "210mm"; // A4 size width
    idCard.style.height = "297mm"; // A4 size height
    idCard.style.padding = "10mm"; // Optional: adjust padding to fit content
  
    // Fill the div with the passenger's card content
    idCard.innerHTML = `
      <table class="id-card-table">
        <tbody>
          <tr>
            <td colSpan="1" style="color: red; font-weight: 700; text-align: left; font-size: 10px; white-space: nowrap;">॥ श्री खाटू श्याम देवाय नमः ॥</td>
            <td colSpan="2" style="color: rgb(0, 0, 206); font-weight: 700; font-size: 10px; text-align: right;">रजि. नं. : ${passenger.registrationNumber}</td>
          </tr>
          <tr>
            <td colSpan="3" style="text-align: center; color: rgb(255, 0, 0); font-weight: 900; font-size: 26px;">श्री खाटू श्याम सेवादार समिति</td>
          </tr>
          <tr>
            <td colSpan="3" style="text-align: center; color: rgb(0, 0, 0); font-size: 12px; font-weight: 600;">ए बी 468, दूसरी मंजिल, निर्माण नगर, किंग्स रोड़, अजमेर रोड़, जयपुर मो- 8905902495</td>
          </tr>
          <tr>
            <td colSpan="3" style="text-align: center; color: rgb(255, 0, 43); font-weight: 700; font-size: 15px;">रींगस से खाटूधाम पदयात्रा (दिनांक- 13 फरवरी 2025)</td>
          </tr>
          <tr>
            <td colSpan="1" rowSpan="5" style="text-align: center;">
              <img src="${passenger.image}" class="profile-img" alt="Profile" style="width: 80px; height: 80px; border-radius: 50%;" />
            </td>
            <td class="large-text" colSpan="2" style="color: rgb(0, 0, 0); font-weight: 600; border-bottom: dotted 1px rgb(58, 58, 58);">रजिस्ट्रेशन नं. - ${passenger.registrationNumber}</td>
          </tr>
          <tr>
            <td colSpan="2" class="large-text" style="color: rgb(0, 0, 0); font-weight: 600; border-bottom: dotted 1px rgb(58, 58, 58);">पदयात्री का नाम - ${passenger.name}</td>
          </tr>
          <tr>
            <td colSpan="3" class="large-text" style="color: rgb(0, 0, 0); font-weight: 600; border-bottom: 1px dotted rgb(58, 58, 58);">पिता का नाम - ${passenger.fatherName}</td>
          </tr>
          <tr>
            <td colSpan="2" class="large-text" style="color: rgb(0, 0, 0); font-weight: 600; border-bottom: 1px dotted rgb(58, 58, 58);">पदयात्री मोबाइल नं. - ${passenger.phoneNumber}</td>
          </tr>
          <tr>
            <td colSpan="2" class="large-text" style="color: rgb(0, 0, 0); font-weight: 600;">पदयात्री का पता - ${passenger.address}</td>
          </tr>
          <tr>
            <td colSpan="3" style="text-align: center; color: rgb(12, 0, 177); font-weight: 700; font-size: 13px; border-top: solid 2px black;">
              सम्पर्क सूत्र : 8696555530, 9887662860, 9828156963, 6376999432, 9314476414, 9828256321, 9782676365
            </td>
          </tr>
        </tbody>
      </table>
    `;
  
    // Append the temporary div to the DOM
    document.body.appendChild(idCard);
  
    // Wait for the image to load (in case it's still loading)
    const imgElement = idCard.querySelector("img");
    imgElement.onload = () => {
      html2canvas(idCard, { allowTaint: true, useCORS: true }).then((canvas) => {
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL("image/png");
  
        // Add image to PDF
        pdf.addImage(imgData, "PNG", 10, 10, 180, 100); // Adjust width and height as needed
        pdf.save(`${passenger.name}_ID_Card.pdf`);
  
        // Clean up by removing the temporary div after generating the PDF
        document.body.removeChild(idCard); // Ensure removal after PDF generation
      }).catch((error) => {
        console.error("Error during canvas rendering:", error);
        document.body.removeChild(idCard); // Ensure removal in case of error
      });
    };
  
    // In case the image is cached already, run html2canvas immediately
    if (imgElement.complete) {
      html2canvas(idCard, { allowTaint: true, useCORS: true }).then((canvas) => {
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL("image/png");
  
        // Add image to PDF
        pdf.addImage(imgData, "PNG", 10, 10, 180, 100); // Adjust width and height as needed
        pdf.save(`${passenger.name}_ID_Card.pdf`);
  
        // Clean up by removing the temporary div after generating the PDF
        document.body.removeChild(idCard); // Ensure removal after PDF generation
      }).catch((error) => {
        console.error("Error during canvas rendering:", error);
        document.body.removeChild(idCard); // Ensure removal in case of error
      });
    }
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
            <th>Image</th>
            <th>Download PDF</th>
          </tr>
        </thead>
        <tbody>
          {passengers && passengers.length > 0 ? (
            passengers.map((passenger) => (
              <tr key={passenger._id}>
                <td>{passenger.registrationNumber}</td>
                <td>{passenger.name}</td>
                <td>{passenger.fatherName}</td>
                <td>{passenger.phoneNumber}</td>
                <td>{passenger.address}</td>
                <td>{passenger.disease}</td>
                <td>{passenger.reference}</td>
                <td>
                  <img
                    src={passenger.image}
                    alt="Profile"
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                </td>
                <td>
                  <button onClick={() => handleDownloadPDF(passenger._id)}>
                    Download PDF
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No passengers available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerTable;
