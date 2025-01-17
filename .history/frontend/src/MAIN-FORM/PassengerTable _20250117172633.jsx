import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./App.css";

const PassengerTable = () => {
  const [passengers, setPassengers] = useState([]);
  const [error, setError] = useState("");
  const [selectedPassenger, setSelectedPassenger] = useState(null); // Track selected passenger

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
    const passenger = passengers.find((p) => p._id === passengerId);
    setSelectedPassenger(passenger);

    const pdf = new jsPDF();
    const idCard = document.createElement("div"); // Create ID card dynamically
    idCard.id = `id-card-${passenger._id}`;
    idCard.style.position = "absolute";
    idCard.style.left = "-9999px"; // Make it off-screen
    idCard.style.top = "-9999px"; // Make it off-screen

    // Populate the ID card content
    idCard.innerHTML = `
      <table class="id-card-table">
        <tbody>
          <tr>
            <td colSpan="1" style="color: red; font-weight: 700; text-align: left; font-size: 10px; white-space: nowrap;">
              ॥ श्री खाटू श्याम देवाय नमः ॥ 
            </td>
            <td colSpan="2" style="color: rgb(0, 0, 206); font-weight: 700; font-size: 10px; text-align: right;">
              रजि. नं. : ${passenger.registrationNumber}
            </td>
          </tr>
          <tr>
            <td colSpan="3" style="text-align: center; color: rgb(255, 0, 0); font-weight: 900; font-size: 26px;">
              श्री खाटू श्याम सेवादार समिति
            </td>
          </tr>
          <tr>
            <td colSpan="3" style="text-align: center; color: rgb(0, 0, 0); font-size: 12px; font-weight: 600;">
              ए बी 468, दूसरी मंजिल, निर्माण नगर, किंग्स रोड़, अजमेर रोड़, जयपुर मो- 8905902495
            </td>
          </tr>
          <tr>
            <td colSpan="3" style="text-align: center; color: rgb(255, 0, 43); font-weight: 700; font-size: 15px;">
              रींगस से खाटूधाम पदयात्रा (दिनांक- 13 फरवरी 2025)
            </td>
          </tr>
          <tr>
            <td colSpan="1" rowSpan="5" style="text-align: center;">
              <img src="${passenger.image}" class="profile-img" alt="Profile" style="width: 80px; height: 80px; border-radius: 50%;" />
            </td>
            <td colSpan="2" style="color: rgb(0, 0, 0); font-weight: 600; border-bottom: dotted 1px rgb(58, 58, 58);">
              रजिस्ट्रेशन नं. - ${passenger.registrationNumber}
            </td>
          </tr>
          <tr>
            <td colSpan="2" style="color: rgb(0, 0, 0); font-weight: 600; border-bottom: dotted 1px rgb(58, 58, 58);">
              पदयात्री का नाम - ${passenger.name}
            </td>
          </tr>
          <tr>
            <td colSpan="3" style="color: rgb(0, 0, 0); font-weight: 600; border-bottom: 1px dotted rgb(58, 58, 58);">
              पिता का नाम - ${passenger.fatherName}
            </td>
          </tr>
          <tr>
            <td colSpan="2" style="color: rgb(0, 0, 0); font-weight: 600; border-bottom: 1px dotted rgb(58, 58, 58);">
              पदयात्री मोबाइल नं. - ${passenger.phoneNumber}
            </td>
          </tr>
          <tr>
            <td colSpan="2" style="color: rgb(0, 0, 0); font-weight: 600;">
              पदयात्री का पता - ${passenger.address}
            </td>
          </tr>
          <tr>
            <td colSpan="3" style="text-align: center; color: rgb(12, 0, 177); font-weight: 700; font-size: 13px; border-top: solid 2px black;">
              सम्पर्क सूत्र : 8696555530, 9887662860, 9828156963, 6376999432, 9314476414, 9828256321, 9782676365
            </td>
          </tr>
        </tbody>
      </table>
    `;

    // Append the ID card to the DOM (off-screen)
    document.body.appendChild(idCard);

    // Generate the PDF
    html2canvas(idCard).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
      pdf.save(`${passenger.name}_ID_Card.pdf`);

      // Clean up by removing the ID card after PDF generation
      document.body.removeChild(idCard);
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
            <th>Image</th>
            <th>Payment Status</th>
            <th>Action</th>
            <th>Download PDF</th>
          </tr>
        </thead>
        <tbody>
          {passengers && passengers.length > 0 ? (
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
                    <img
                      src={passenger.image}
                      alt="Profile"
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    />
                  </td>
                  <td></td>
                  <td>
                    <button onClick={() => handleDownloadPDF(passenger._id)}>Edit</button>
                    <button onClick={() => handleDownloadPDF(passenger._id)}>Delete</button>

                  </td>
                  <td>
                    <button onClick={() => handleDownloadPDF(passenger._id)}>
                      Download PDF
                    </button>
                  </td>
                </tr>
              </React.Fragment>
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
