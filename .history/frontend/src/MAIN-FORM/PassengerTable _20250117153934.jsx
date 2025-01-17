import React, { useEffect, useState } from 'react';

const PassengerTable = () => {
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    const fetchPassengers = async () => {
      const response = await fetch('/api/getPassengers');
      const data = await response.json();
      setPassengers(data);
    };

    fetchPassengers();
  }, []);

  const handleDownload = async (id) => {
    const response = await fetch(`/api/download/${id}`, {
      method: 'GET',
    });
    if (response.ok) {
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `passenger_${id}_id_card.pdf`;
      link.click();
    } else {
      console.error('Error downloading ID card');
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Image</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((passenger) => (
            <tr key={passenger.id}>
              <td>{passenger.name}</td>
              <td>{passenger.age}</td>
              <td>
                <img src={passenger.image} alt="Passenger" width={50} />
              </td>
              <td>
                <button onClick={() => handleDownload(passenger.id)}>Download ID Card</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerTable;
