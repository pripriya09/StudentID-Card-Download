import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';

const PassengerTable = () => {
  const [students, setStudents] = useState([]);

  // Fetch students data from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:6009/api/students');
        setStudents(response.data.allstudents); // Set the fetched students data
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  // Function to download ID card PDF for a single student
  const handleDownloadPDF = (student) => {
    const pdf = new jsPDF();
    const card = document.querySelector(`#id-card-${student.registrationNumber}`);

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
      pdf.save(`Student_ID_Card_${student.registrationNumber}.pdf`);
    });
  };

  return (
    <div>
      <table className="student-table">
        <thead>
             <tr>
            <th>Registration Number</th>
            <th>Name</th>
            <th>Father Name</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Disease</th>
            <th>Reference</th>
            <th>Image</th>
            <th>Actions</th>
            <th>Download PDF</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
           <tr>
           <td>{student.registrationNumber}</td>
           <td>{student.name}</td>
           <td>{student.fatherName}</td>
           <td>{student.phoneNumber}</td>
           <td>{passenger.address}</td>
           <td>{passenger.disease}</td>
           <td>{passenger.reference}</td>
           <td>
           <td>
<img
src={passenger.image}
alt="Profile"
style={{ width: "50px", height: "50px", borderRadius: "50%" }}
onLoad={handleImageLoad}
/>
</td>

           </td>
           <td>
             <button onClick={() => handleEdit(passenger._id)}>Edit</button>
             <button onClick={() => handleCancel(passenger._id)}>Cancel</button>
           </td>
           <td>
             <button onClick={() => handleDownloadPDF(passenger)}>Download PDF</button>
           </td>
         </tr>
          ))}
        </tbody>
      </table>

      {/* Render ID Cards for each student */}
      {students.map((student, index) => (
        <div
          id={`id-card-${student.registrationNumber}`}
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
                  <img src={student.image || './shyam.jpg'} className="profile-img" alt="Profile" />
                </td>
                <td className="large-text" colSpan="2" style={{ color: 'rgb(0, 0, 0)', fontWeight: 600, borderBottom: 'dotted 1px rgb(58, 58, 58)' }}>
                  रजिस्ट्रेशन नं. - {student.registrationNumber}
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="large-text" style={{ color: 'rgb(0, 0, 0)', fontWeight: 600, borderBottom: 'dotted 1px rgb(58, 58, 58)' }}>
                  पदयात्री का नाम - {student.name}
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="large-text" style={{ color: 'rgb(0, 0, 0)', fontWeight: 600, borderBottom: '1px dotted rgb(58, 58, 58)' }}>
                  पिता का नाम - {student.fatherName}
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="large-text" style={{ color: 'rgb(0, 0, 0)', fontWeight: 600, borderBottom: '1px dotted rgb(58, 58, 58)' }}>
                  पदयात्री मोबाइल नं. - {student.phoneNumber}
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="large-text" style={{ color: 'rgb(0, 0, 0)', fontWeight: 600 }}>
                  पदयात्री का पता - {student.address}
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
