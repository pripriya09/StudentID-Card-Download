import React from "react";
import { useLocation } from "react-router-dom";

const PassengerTable = () => {
  const location = useLocation();
  const { formData } = location.state || {}; // Retrieve formData from location state

  if (!formData || formData.length === 0) {
    return <p>No passenger data available.</p>;
  }

  return (
    <div className="passenger-table">
      <h1>Passenger ID Cards</h1>
      {formData.map((data, index) => (
        <table className="id-card-table" key={index}>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{data.name}</td>
            </tr>
            <tr>
              <td>Father's Name:</td>
              <td>{data.fatherName}</td>
            </tr>
            <tr>
              <td>Phone Number:</td>
              <td>{data.phoneNumber}</td>
            </tr>
            <tr>
              <td>Address:</td>
              <td>{data.address}</td>
            </tr>
            <tr>
              <td>Reference:</td>
              <td>{data.reference}</td>
            </tr>
            <tr>
              <td>Image:</td>
              <td>
                <img
                  src={data.image || "./shyam.jpg"}
                  alt="Passenger"
                  style={{ width: "100px", height: "100px" }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
};
export default UserCards