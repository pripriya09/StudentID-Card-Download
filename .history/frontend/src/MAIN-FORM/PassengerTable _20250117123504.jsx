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
              <td>   <button onClick={() =>handleDownloadPDF()}>Download PDF</button></td>
              </tr>
            ))}
          </tbody>
        ) : (
          <p>No passengers available.</p>
        )}
      </table>
    </div>
  );
};

export default PassengerTable;
