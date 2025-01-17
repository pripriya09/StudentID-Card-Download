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

  const handleDownloadPDF = (passenger) => {
    const pdf = new jsPDF();
    const idCardElement = document.getElementById(`id-card-${passenger._id}`);

    html2canvas(idCardElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${passenger.name}_ID_Card.pdf`);
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
                    <button onClick={() => handleEdit(passenger._id)}>Edit</button>
                    <button onClick={() => handleCancel(passenger._id)}>Cancel</button>
                  </td>
                  <td>
                    <button onClick={() => handleDownloadPDF(passenger)}>Download PDF</button>
                  </td>
                </tr>
                {/* Hidden ID Card */}
                <tr style={{ display: "none" }}>
                  <td colSpan="9">
                    <div id={`id-card-${passenger._id}`} className="id-card">
                      <table className="id-card-table">
                        <tbody>
                          <tr>
                            <td colSpan="3" style={{ textAlign: "center" }}>
                              श्री खाटू श्याम सेवादार समिति
                            </td>
                          </tr>
                          <tr>
                            <td>रजिस्ट्रेशन नं.</td>
                            <td colSpan="2">{passenger.registrationNumber}</td>
                          </tr>
                          <tr>
                            <td>पदयात्री का नाम</td>
                            <td colSpan="2">{passenger.name}</td>
                          </tr>
                          <tr>
                            <td>पिता का नाम</td>
                            <td colSpan="2">{passenger.fatherName}</td>
                          </tr>
                          <tr>
                            <td>मोबाइल नं.</td>
                            <td colSpan="2">{passenger.phoneNumber}</td>
                          </tr>
                          <tr>
                            <td>पता</td>
                            <td colSpan="2">{passenger.address}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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
