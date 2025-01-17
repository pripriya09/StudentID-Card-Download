import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PassengerTable = () => {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all students when the component mounts
    const fetchPassengers = async () => {
      try {
        const response = await axios.get('http://localhost:6009/api/students');
        setPassengers(response.data.allstudents);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch passengers');
        setLoading(false);
      }
    };

    fetchPassengers();
  }, []);

  // Check for loading or error
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Passenger Details</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Father's Name</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Disease</th>
            <th>Reference</th>
            <th>Image</th>
            <th>Registration Number</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((passenger) => (
            <tr key={passenger.registrationNumber}>
              <td>{passenger.name}</td>
              <td>{passenger.fatherName}</td>
              <td>{passenger.phoneNumber}</td>
              <td>{passenger.address}</td>
              <td>{passenger.disease}</td>
              <td>{passenger.reference}</td>
              <td>
                <img
                  src={passenger.image}
                  alt={passenger.name}
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              </td>
              <td>{passenger.registrationNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerTable;
