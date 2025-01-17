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
    idCard.style.width = "300px";  // Set width for the ID card
    idCard.style.height = "50px"; // Set height for the ID card
  
    idCard.innerHTML = `
      <table style="width: 100%; background-color: #ffecec; border: 2px solid #333; padding: 10px;">
        <tbody>
          <tr>
            <td style="color: red; font-weight: 700; text-align: left; font-size: 10px;">॥ श्री खाटू श्याम देवाय नमः ॥</td>
            <td colspan="2" style="color: rgb(0, 0, 206); font-weight: 700; font-size: 10px; text-align: right;">रजि. नं. : ${passenger.registrationNumber}</td>
          </tr>
          <tr>
            <td colspan="3" style="color: rgb(255, 0, 0); font-weight: 900; font-size: 26px; text-align: center; filter: drop-shadow(2px 1px 1px rgb(255, 230, 7));">
              श्री खाटू श्याम सेवादार समिति
            </td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: center; color: rgb(0, 0, 0); font-size: 12px; font-weight: 600;">
              ए बी 468, दूसरी मंजिल, निर्माण नगर, किंग्स रोड़, अजमेर रोड़, जयपुर मो- 8905902495
            </td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: center; color: rgb(255, 0, 43); font-weight: 700; font-size: 15px;">
              रींगस से खाटूधाम पदयात्रा (दिनांक- 13 फरवरी 2025)
            </td>
          </tr>
          <tr>
            <td colspan="2" rowspan="4">
              <img src="${passenger.image}" class="profile-img" alt="" style="width: 80px; height: 80px; border: solid 2px rgb(133, 46, 46); object-fit: fill;" />
            </td>
            <td colspan="2" style="color: rgb(0, 0, 0); font-weight: 600; font-size: 13px; border-bottom: dotted 1px rgb(58, 58, 58); padding-left: 10px;">
              रजिस्ट्रेशन नं. - ${passenger.registrationNumber}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="color: rgb(0, 0, 0); font-weight: 600; font-size: 13px; border-bottom: dotted 1px rgb(58, 58, 58); padding-left: 10px;">
              पदयात्री का नाम - ${passenger.name}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="color: rgb(0, 0, 0); font-weight: 600; font-size: 13px; border-bottom: dotted 1px rgb(58, 58, 58); padding-left: 10px;">
              मोबाईल नं. - ${passenger.phoneNumber}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="color: rgb(0, 0, 0); font-weight: 600; font-size: 13px; padding-left: 10px;">
              पदयात्री का पता - ${passenger.address}
            </td>
          </tr>
          <tr>
            <td colspan="3" style="color: rgb(12, 0, 177); font-weight: 700; font-size: 13px; text-align: center; border-top: solid 2px black;">
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
      pdf.addImage(imgData, "PNG", 10, 10, 180, 100); // Adjust the width and height here as per your layout
      pdf.save(`${passenger.name}_ID_Card.pdf`);
  
      // Clean up by removing the ID card after PDF generation
      document.body.removeChild(idCard);
    });
  };
  
  const handleEditPassenger = (passengerId) => {
    const passengerToEdit = passengers.find((p) => p._id === passengerId);
    console.log("Edit passenger:", passengerToEdit);
    // Implement the edit logic (e.g., show a form with the passenger details)
  };

  const handleDeletePassenger = (passengerId) => {
    if (window.confirm("Are you sure you want to delete this passenger?")) {
      // Call the backend to delete the passenger
      axios
        .delete(`http://localhost:6009/api/students/${passengerId}`)
        .then(() => {
          setPassengers((prevPassengers) =>
            prevPassengers.filter((p) => p._id !== passengerId)
          );
        })
        .catch((err) => {
          console.error("Failed to delete passenger:", err);
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
                    <button onClick={() => handleEditPassenger(passenger._id)}>Edit</button>
                    <button onClick={() => handleDeletePassenger(passenger._id)}>Delete</button>
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
