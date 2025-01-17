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
      <th>Image</th> {/* Added Image Column */}
      <th>Actions</th>
      <th>Download PDF</th>
    </tr>
  </thead>
  <tbody>
    {passengers && passengers.length > 0 ? (
      passengers.map((passenger) => (
        <tr key={passenger._id}>
          <td>{passenger.registrationNumber}</td>
          <td>{passenger.name}</td>
          <td>{passenger.fatherName}</td>
          <td>{passenger.phoneNumber}</td>
          <td>{passenger.address}</td>
          <td>{passenger.disease}</td>
          <td>{passenger.reference}</td>
          <td>
            {/* Display the image for each passenger */}
            <img
              src={passenger.image} // Base64 image data
              alt="Profile"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          </td>
          <td>
            <button onClick={() => handleEdit(passenger._id)}>Edit</button>
            <button onClick={() => handleCancel(passenger._id)}>Cancel</button>
          </td>
          <td>
            <button onClick={() => handleDownloadPDF(passenger)}>Download PDF</button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="10">No passengers available.</td>
      </tr>
    )}
  </tbody>
</table>
