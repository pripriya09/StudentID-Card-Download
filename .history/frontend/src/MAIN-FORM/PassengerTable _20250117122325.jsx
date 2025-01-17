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
        setPassengers(response.data); // Update state with response data
      })
      .catch((err) => {
        setError("Failed to fetch passengers.");
        console.error(err);
      });
  }, []);

  const handleEdit = (id) => {
    console.log(`Edit passenger with ID: ${id}`);
  };

  const handleCancel = (id) => {
    axios
      .delete(`http://localhost:6009/api/students/${id}`)
      .then(() => {
        setPassengers(passengers.filter((passenger) => passenger._id !== id));
      })
      .catch((err) => {
        console.error("Failed to delete passenger:", err);
      });
  };

  const handleDownloadPDF = () => {
    console.log("Download PDF");
  };

  return (
    <div>
      <h1>Passenger Details</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleDownloadPDF}>Download PDF</button>
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
  
