import React, { useState } from 'react';

const PassengerForms = () => {
  const [passengerCount, setPassengerCount] = useState(0);
  const [passengerData, setPassengerData] = useState([]);

  const handlePassengerCountChange = (e) => {
    const count = parseInt(e.target.value, 10) || 0;
    setPassengerCount(count);
    setPassengerData(Array.from({ length: count }, () => ({
      name: '',
      fatherName: '',
      phoneNumber: '',
      address: '',
      consent: false,
      image: null,
    })));
  };

  const handleInputChange = (index, field, value) => {
    const updatedData = [...passengerData];
    updatedData[index][field] = value;
    setPassengerData(updatedData);
  };

  return (
    <div>
      <label>
        Number of Passengers:
        <input
          type="number"
          min="1"
          max="6"
          value={passengerCount}
          onChange={handlePassengerCountChange}
          placeholder="Enter number of passengers"
        />
      </label>

      <div id="passengerForms">
        {passengerData.map((passenger, index) => (
          <form key={index}>
            <h3>Passenger {index + 1}</h3>
            <label>
              Name:
              <input
                type="text"
                value={passenger.name}
                onChange={(e) =>
                  handleInputChange(index, 'name', e.target.value)
                }
                placeholder="Enter Name"
              />
            </label>
            <label>
              Father's Name:
              <input
                type="text"
                value={passenger.fatherName}
                onChange={(e) =>
                  handleInputChange(index, 'fatherName', e.target.value)
                }
                placeholder="Enter Father's Name"
              />
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                value={passenger.phoneNumber}
                onChange={(e) =>
                  handleInputChange(index, 'phoneNumber', e.target.value)
                }
                placeholder="Enter Phone Number"
              />
            </label>
            <label>
              Upload Image:
              <input
                type="file"
                onChange={(e) =>
                  handleInputChange(index, 'image', e.target.files[0])
                }
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                value={passenger.address}
                onChange={(e) =>
                  handleInputChange(index, 'address', e.target.value)
                }
                placeholder="Enter Address"
              />
            </label>
            <label>
              Consent:
              <input
                type="checkbox"
                checked={passenger.consent}
                onChange={(e) =>
                  handleInputChange(index, 'consent', e.target.checked)
                }
              />
              I consent
            </label>
          </form>
        ))}
      </div>
    </div>
  );
};

export default PassengerForms;
