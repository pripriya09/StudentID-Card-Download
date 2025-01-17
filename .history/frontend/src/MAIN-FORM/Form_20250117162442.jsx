import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const PassengerTable = ({ passengersData }) => {
  // Function to download ID card PDF for a single passenger
  const handleDownloadPDF = (passenger) => {
    const pdf = new jsPDF();
    const card = document.querySelector(`#id-card-${passenger.registrationNumber}`);

    html2canvas(card, { scale: 1 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const cardWidth = 100;
      const cardHeight = 60;
      const margin = 3;
      const x = margin;
      const y = margin;

      pdf.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight);
      pdf.save(`Passenger_ID_Card_${passenger.registrationNumber}.pdf`);
    });
  };

  return (
    <div>
      <table className="passenger-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Registration Number</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {passengersData.map((passenger, index) => (
            <tr key={index}>
              <td>{passenger.name}</td>
              <td>{passenger.registrationNumber}</td>
              <td>{passenger.phoneNumber}</td>
              <td>{passenger.address}</td>
              <td>
                <button onClick={() => handleDownloadPDF(passenger)}>Download PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render ID Cards for each passenger */}
      {passengersData.map((passenger, index) => (
        <div
          id={`id-card-${passenger.registrationNumber}`}
          className="id-card-table"
          key={index}
          style={{ display: 'none' }} // Hide the ID card initially, it's used for PDF generation only
        >
          <table>
            <tbody>
              <tr>
                <td colSpan="1" style={{ color: 'red', fontWeight: 700, textAlign: 'left', fontSize: '10px', whiteSpace: 'nowrap' }}>
                  ॥ श्री खाटू श्याम देवाय नमः ॥
                </td>
                <td colSpan="2" style={{ color: 'rgb(0, 0, 206)', fontWeight: 700, fontSize: '10px', textAlign: 'right' }}>
                  रजि. नं. : COOPI2024 / JAIPURI206591
                </td>
              </tr>
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', color: 'rgb(255, 0, 0)', fontWeight: 900, fontSize: '26px' }}>
                  श्री खाटू श्याम सेवादार समिति
                </td>
              </tr>
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', color: 'rgb(0, 0, 0)', fontSize: '12px', fontWeight: 600 }}>
                  ए बी 468, दूसरी मंजिल, निर्माण नगर, किंग्स रोड़, अजमेर रोड़, जयपुर मो- 8905902495
                </td>
              </tr>
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', color: 'rgb(255, 0, 43)', fontWeight: 700, fontSize: '15px' }}>
                  रींगस से खाटूधाम पदयात्रा (दिनांक- 13 फरवरी 2025)
                </td>
              </tr>
              <tr>
                <td colSpan="1" rowSpan="5" style={{ textAlign: 'center' }}>
                  <img src={passenger.image || './shyam.jpg'} className="profile-img" alt="Profile" />
                </td>
                <td className="large-text" colSpan="2" style={{ color: 'rgb(0, 0, 0)', fontWeight: 600, borderBottom: 'dotted 1px rgb(58, 58, 58)' }}>
                  रजिस्ट्रेशन नं. - {passenger.registrationNumber}
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="large-text" style={{ color: 'rgb(0, 0, 0)', fontWeight: 600, borderBottom: 'dotted 1px rgb(58, 58, 58)' }}>
                  पदयात्री का नाम - {passenger.name}
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="large-text" style={{ color: 'rgb(0, 0, 0)', fontWeight: 600, borderBottom: '1px dotted rgb(58, 58, 58)' }}>
                  पिता का नाम - {passenger.fatherName}
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="large-text" style={{ color: 'rgb(0, 0, 0)', fontWeight: 600, borderBottom: '1px dotted rgb(58, 58, 58)' }}>
                  पदयात्री मोबाइल नं. - {passenger.phoneNumber}
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="large-text" style={{ color: 'rgb(0, 0, 0)', fontWeight: 600 }}>
                  पदयात्री का पता - {passenger.address}
                </td>
              </tr>
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', color: 'rgb(12, 0, 177)', fontWeight: 700, fontSize: '13px', borderTop: 'solid 2px black' }}>
                  सम्पर्क सूत्र : 8696555530, 9887662860, 9828156963, 6376999432, 9314476414, 9828256321, 9782676365
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default PassengerTable;
