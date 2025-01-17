import React, { useEffect, useState } from "react";
import axios from "axios";

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

const handleDownloadPDF =(id) =>{
  
}



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
        {passengers && passengers.length > 0 ? (
          <tbody>
            {passengers.map((passenger) => (
              <tr key={passenger._id}>
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
                <button onClick={() =>handleDownloadPDF(passenger._id)}>Download PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <p>No passengers available.</p>
        )}
      </table>

      <table className="id-card-table" key={index} >
    <tbody>
      {/* First Row */}
      <tr>
      
        <td colSpan="1" style={{ color: "red", fontWeight: 700, textAlign: "left", fontSize: "10px", whiteSpace: "nowrap" }}>
          ॥ श्री खाटू श्याम देवाय नमः ॥
        </td>
        <td colSpan="2" style={{ color: "rgb(0, 0, 206)", fontWeight: 700, fontSize: "10px", textAlign: "right" }}>
          रजि. नं. : COOPI2024 / JAIPURI206591
        </td>
      </tr>
      
      {/* Title Row */}
      <tr>
        <td colSpan="3" style={{ textAlign: "center", color: "rgb(255, 0, 0)", fontWeight: 900, fontSize: "26px" }}>
          श्री खाटू श्याम सेवादार समिति
        </td>
      </tr>
      
      {/* Address Row */}
      <tr>
        <td colSpan="3" style={{ textAlign: "center", color: "rgb(0, 0, 0)", fontSize: "12px", fontWeight: 600 }}>
          ए बी 468, दूसरी मंजिल, निर्माण नगर, किंग्स रोड़, अजमेर रोड़, जयपुर मो- 8905902495
        </td>
      </tr>
      
      {/* Event Row */}
      <tr>
        <td colSpan="3" style={{ textAlign: "center", color: "rgb(255, 0, 43)", fontWeight: 700, fontSize: "15px" }}>
          रींगस से खाटूधाम पदयात्रा (दिनांक- 13 फरवरी 2025)
        </td>
      </tr>

      {/* ID Card Details */}
      <tr>
        {/* Profile Image Column */}
        <td colSpan="1" rowSpan="5" style={{ textAlign: "center" }}>
          <img src={data.image || './shyam.jpg'} className="profile-img" alt="Profile" />
        </td>

        {/* Registration Number */}
        <td className="large-text" colSpan="2" style={{ color: "rgb(0, 0, 0)", fontWeight: 600, borderBottom: "dotted 1px rgb(58, 58, 58)" }}>
          रजिस्ट्रेशन नं. - {data.registrationNumber}
        </td>
      </tr>
      
      {/* Name Row */}
      <tr>
        <td colSpan="2" className="large-text" style={{ color: "rgb(0, 0, 0)", fontWeight: 600, borderBottom: "dotted 1px rgb(58, 58, 58)"}}>
          पदयात्री का नाम - {data.name}
        </td>
      </tr>
      
      {/* Father’s Name Row */}
      <tr>
        <td colSpan="3" className="large-text" style={{ color: "rgb(0, 0, 0)", fontWeight: 600, borderBottom: "1px dotted rgb(58, 58, 58)",  }}>
          पिता का नाम - {data.fatherName}
        </td>
      </tr>
      
      {/* Phone Number Row */}
      <tr>
        <td colSpan="2" className="large-text" style={{ color: "rgb(0, 0, 0)", fontWeight: 600, borderBottom: "1px dotted rgb(58, 58, 58)",}}>
          पदयात्री मोबाइल नं. - {data.phoneNumber}
        </td>
      </tr>
      
      {/* Address Row */}
      <tr>
        <td colSpan="2" className="large-text" style={{ color: "rgb(0, 0, 0)", fontWeight: 600, }}>
          पदयात्री का पता - {data.address}
        </td>
      </tr>

      {/* Contact Information Row */}
      <tr>
        <td colSpan="3" style={{ textAlign: "center", color: "rgb(12, 0, 177)", fontWeight: 700, fontSize: "13px", borderTop: "solid 2px black" }}>
          सम्पर्क सूत्र : 8696555530, 9887662860, 9828156963, 6376999432, 9314476414, 9828256321, 9782676365
        </td>
      </tr>
    </tbody>
  </table>
    </div>
  );
};

export default PassengerTable;
