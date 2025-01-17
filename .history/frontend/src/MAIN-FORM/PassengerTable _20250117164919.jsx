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
    const idCard = document.getElementById(`id-card-${passenger._id}`);

    if (idCard) {
      html2canvas(idCard).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
        pdf.save("Passenger_ID_Card.pdf");
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
                  <td>
                    <button onClick={() => handleDownloadPDF(passenger._id)}>
                      Download PDF
                    </button>
                  </td>
                </tr>

                {/* Display ID Card */}
                {selectedPassenger && selectedPassenger._id === passenger._id && (
                  <tr>
                    <td colSpan="9">
                      <div id={`id-card-${passenger._id}`} className="id-card">
                        {/* ID Card Layout */}
                        <table className="id-card-table">
                          <tbody>
                            <tr>
                              <td
                                colSpan="1"
                                style={{
                                  color: "red",
                                  fontWeight: 700,
                                  textAlign: "left",
                                  fontSize: "10px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                ॥ श्री खाटू श्याम देवाय नमः ॥
                              </td>
                              <td
                                colSpan="2"
                                style={{
                                  color: "rgb(0, 0, 206)",
                                  fontWeight: 700,
                                  fontSize: "10px",
                                  textAlign: "right",
                                }}
                              >
                                रजि. नं. : {passenger.registrationNumber}
                              </td>
                            </tr>

                            <tr>
                              <td
                                colSpan="3"
                                style={{
                                  textAlign: "center",
                                  color: "rgb(255, 0, 0)",
                                  fontWeight: 900,
                                  fontSize: "26px",
                                }}
                              >
                                श्री खाटू श्याम सेवादार समिति
                              </td>
                            </tr>

                            <tr>
                              <td
                                colSpan="3"
                                style={{
                                  textAlign: "center",
                                  color: "rgb(0, 0, 0)",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                }}
                              >
                                ए बी 468, दूसरी मंजिल, निर्माण नगर, किंग्स रोड़, अजमेर रोड़, जयपुर मो- 8905902495
                              </td>
                            </tr>

                            <tr>
                              <td
                                colSpan="3"
                                style={{
                                  textAlign: "center",
                                  color: "rgb(255, 0, 43)",
                                  fontWeight: 700,
                                  fontSize: "15px",
                                }}
                              >
                                रींगस से खाटूधाम पदयात्रा (दिनांक- 13 फरवरी 2025)
                              </td>
                            </tr>

                            <tr>
                              <td
                                colSpan="1"
                                rowSpan="5"
                                style={{ textAlign: "center" }}
                              >
                                <img
                                  src={passenger.image}
                                  className="profile-img"
                                  alt="Profile"
                                  style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                                />
                              </td>

                              <td
                                className="large-text"
                                colSpan="2"
                                style={{
                                  color: "rgb(0, 0, 0)",
                                  fontWeight: 600,
                                  borderBottom: "dotted 1px rgb(58, 58, 58)",
                                }}
                              >
                                रजिस्ट्रेशन नं. - {passenger.registrationNumber}
                              </td>
                            </tr>

                            <tr>
                              <td
                                colSpan="2"
                                className="large-text"
                                style={{
                                  color: "rgb(0, 0, 0)",
                                  fontWeight: 600,
                                  borderBottom: "dotted 1px rgb(58, 58, 58)",
                                }}
                              >
                                पदयात्री का नाम - {passenger.name}
                              </td>
                            </tr>

                            <tr>
                              <td
                                colSpan="3"
                                className="large-text"
                                style={{
                                  color: "rgb(0, 0, 0)",
                                  fontWeight: 600,
                                  borderBottom: "1px dotted rgb(58, 58, 58)",
                                }}
                              >
                                पिता का नाम - {passenger.fatherName}
                              </td>
                            </tr>

                            <tr>
                              <td
                                colSpan="2"
                                className="large-text"
                                style={{
                                  color: "rgb(0, 0, 0)",
                                  fontWeight: 600,
                                  borderBottom: "1px dotted rgb(58, 58, 58)",
                                }}
                              >
                                पदयात्री मोबाइल नं. - {passenger.phoneNumber}
                              </td>
                            </tr>

                            <tr>
                              <td
                                colSpan="2"
                                className="large-text"
                                style={{
                                  color: "rgb(0, 0, 0)",
                                  fontWeight: 600,
                                }}
                              >
                                पदयात्री का पता - {passenger.address}
                              </td>
                            </tr>

                            <tr>
                              <td
                                colSpan="3"
                                style={{
                                  textAlign: "center",
                                  color: "rgb(12, 0, 177)",
                                  fontWeight: 700,
                                  fontSize: "13px",
                                  borderTop: "solid 2px black",
                                }}
                              >
                                सम्पर्क सूत्र : 8696555530, 9887662860, 9828156963, 6376999432, 9314476414, 9828256321, 9782676365
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
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
