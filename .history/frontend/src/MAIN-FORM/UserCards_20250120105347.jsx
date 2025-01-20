import React from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const UserCards = () => {
  const location = useLocation();
  const { formData } = location.state || {}; 

  if (!formData || formData.length === 0) {
    return <p>No passenger data available.</p>;
  }

  
  const handleDownloadPDF = () => {
    // Check if all passengers have a valid registration number
    if (formData.some((data) => !data.registrationNumber)) {
      alert("Please register all passengers before downloading the ID cards.");
      return;
    }
  
    const pdf = new jsPDF();
    const idCardElements = document.querySelectorAll(".id-card-table");
  
    Promise.all(
      Array.from(idCardElements).map((card) =>
        html2canvas(card, { scale: 1 }).then((canvas) =>
          canvas.toDataURL("image/png")
        )
      )
    ).then((images) => {
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      // Define ID card dimensions and spacing
      const cardWidth = 100; // Set desired width for the ID card
      const cardHeight = 60; // Set desired height for the ID card
      const margin = 3; // Margin between cards
      const cardsPerRow = Math.floor(
        (pdfWidth - margin) / (cardWidth + margin)
      );
  
      let x = margin;
      let y = margin;
  
      images.forEach((imgData, index) => {
        // Add image to the PDF
        pdf.addImage(imgData, "PNG", x, y, cardWidth, cardHeight);
  
        // Update x and y for the next card
        x += cardWidth + margin;
  
        // Move to the next row if the current row is full
        if ((index + 1) % cardsPerRow === 0) {
          x = margin;
          y += cardHeight + margin;
  
          // Add a new page if the current page is full
          if (y + cardHeight + margin > pdfHeight) {
            pdf.addPage();
            y = margin;
          }
        }
      });
  
      // Save the PDF
      pdf.save("Passenger_ID_Cards.pdf");
  
    });
  };


  return (<>
    <div className="download-pdf">
          <button className="id-print-btn" onClick={handleDownloadPDF}>
            Download Card in PDF
          </button>
        </div>
    <div className="passenger-table">
      <h1>Passenger ID Cards</h1>
     
        {/* Display ID Card after Successful Submission */}
        { formData.map((data, index) => (
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
          पिता का नाम/ - {data.fatherName}
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
))}
    </div>
    </> );
};
export default UserCards