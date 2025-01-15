import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import "./App.css";

const Form = () => {
  const [count, setCount] = useState(1); // Number of passengers
  const [formData, setFormData] = useState(
    Array.from({ length: 1 }, () => ({
      name: "",
      fatherName: "",
      phoneNumber: "",
      address: "",
      consent: false,
      image: null,
      disease:"",
      reference:"",
    }))
  );
  const [idCardData, setIdCardData] = useState(null);
  const fileInputRefs = useRef([]);
 
  const handleCountChange = (e) => {
    const newCount = parseInt(e.target.value, 10) || 1;
    setCount(newCount);

    // Adjust form data array length
    setFormData((prevData) => {
      const updatedFormData = [...prevData];
      while (updatedFormData.length < newCount) {
        updatedFormData.push({
          name: "",
          fatherName: "",
          phoneNumber: "",
          address: "",
          consent: false,
          image: null,
          disease:"",
          reference:"",
        });
      }
      return updatedFormData.slice(0, newCount);
    });
  };

  const handleChange = (index, e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => {
      const updatedData = [...prevData];
      if (type === "checkbox") {
        updatedData[index][name] = checked;
      } else if (type === "file") {
        const reader = new FileReader();
        reader.onloadend = () => {
          updatedData[index][name] = reader.result;
          setFormData(updatedData);
        };
        if (files[0]) reader.readAsDataURL(files[0]);
      } else {
        updatedData[index][name] = value;
      }
      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all passengers have agreed to terms
    if (formData.some((data) => !data.consent)) {
      alert("All passengers must agree to the terms and conditions.");
      return;
    }

    try {
      const formDataToSubmit = formData.map((data) => {
        // Convert the data into a format the backend expects
        const { name, fatherName, phoneNumber, address, image, consent,disease,reference } = data;
        return {
          name,
          fatherName,
          phoneNumber,
          address,
          image, // Base64 image
          consent,
          disease,
          reference,
        };
      });

      const response = await axios.post("http://localhost:6009/api/students", {
        passengers: formDataToSubmit,
      });

      if (response.status === 200) {
        alert("Passengers registered successfully.");
        console.log("Response Data:", response.data);

        // If the backend provides registration numbers, update the state
        setFormData((prevData) =>
          prevData.map((data, index) => ({
            ...data,
            registrationNumber: response.data.registrationNumbers[index],
          }))
        );
      } else {
        alert("Failed to register passengers. Please try again.");
      }

      setIdCardData(formData)
      
    
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

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
      const margin = 10; // Margin between cards
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
  
    setFormData((prevData) =>
      prevData.map((data) => ({
        ...data,
        name: "",
        fatherName: "",
        phoneNumber: "",
        address: "",
        consent: false,
        disease: "",
        reference: "",
        image: null, // Reset image
        registrationNumber: "",
      }))
    );
  
    // Reset file inputs (clear image fields)
    if (fileInputRefs.current) {
      fileInputRefs.current.forEach((ref) => (ref.value = "")); // Clear file inputs
    }
  };
  

  return (
    <div className="maincontainer">
      <div className="App">
        <label>
          Number of Passengers:
          <input
            type="number"
            min="1"
            max="10"
            value={count}
            onChange={handleCountChange}
          />
        </label>
          <form onSubmit={handleSubmit}>
          <table>
            <thead>
              <tr>
                {/* <th>Passenger</th> */}
                <th>Name</th>
                <th>Father's Name</th>
                <th>Phone Number</th>
                <th>Image</th>
                <th>Address</th>
                <th>Disease (if any)</th>
                <th>Reference (Name & Mobile)</th>
                <th>Consent</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((data, index) => (
                <tr key={index}>
                  {/* <td>Passenger {index + 1}</td> */}
                  <td>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={data.name}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="fatherName"
                      placeholder="Father's Name"
                      value={data.fatherName}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={data.phoneNumber}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="file"
                      name="image"
                      onChange={(e) => handleChange(index, e)}
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={data.address}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="disease"
                      value={data.disease}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="reference"
                      value={data.reference}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      name="consent"
                      checked={data.consent}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="submit">Register Passengers</button>
        </form>
        <div className="download-pdf">
          <button className="id-print-btn" onClick={handleDownloadPDF}>
            Download Card in PDF
          </button>
        </div>
        {formData.map((data, index) => (
  <table className="id-card-table"
   key={index} style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px',margin:'10pxauto' }}>
    <tbody>
      <tr>
        <td
          style={{
            color: 'red',
            fontWeight: 700,
            textAlign: 'center',
            fontSize: '10px',
            whiteSpace: 'nowrap',
          }}
        >
          ॥ श्री खाटू श्याम देवाय नमः ॥
        </td>
        <td
          colSpan="2"
          style={{
            color: 'rgb(0, 0, 206)',
            fontWeight: 700,
            fontSize: '10px',
            textAlign: 'right',
          }}
        >
          रजि. नं. : COOPI2024 / JAIPURI206591
        </td>
      </tr>
      <tr>
        <td colSpan="3" style={{ textAlign: 'center', color: 'rgb(255, 0, 0)', fontWeight: 900, fontSize: '26px' }}>
          श्री खाटू श्याम सेवादार समिति
        </td>
      </tr>
      <tr>
        <td
          colSpan="3"
          style={{
            textAlign: 'center',
            color: 'rgb(0, 0, 0)',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          ए बी 468, दूसरी मंजिल, निर्माण नगर, किंग्स रोड़, अजमेर रोड़, जयपुर मो- 8905902495
        </td>
      </tr>
      <tr>
        <td
          colSpan="3"
          style={{
            textAlign: 'center',
            color: 'rgb(255, 0, 43)',
            fontWeight: 700,
            fontSize: '15px',
          }}
        >
          रींगस से खाटूधाम पदयात्रा (दिनांक- 13 फरवरी 2025)
        </td>
      </tr>
      <tr>
        <td
          colSpan="3"
          style={{
            color: 'rgb(0, 0, 0)',
            fontWeight: 600,
            borderBottom: '1px dotted rgb(58, 58, 58)',
          }}
        >
          रजिस्ट्रेशन नं. - {data.registrationNumber}
        </td>
      </tr>
      <tr>
        <td
          colSpan="3"
          style={{
            color: 'rgb(0, 0, 0)',
            fontWeight: 600,
            borderBottom: '1px dotted rgb(58, 58, 58)',
          }}
        >
          पदयात्री का नाम - {data.name}
        </td>
      </tr>
      <tr>
        <td
          colSpan="3"
          style={{
            color: 'rgb(0, 0, 0)',
            fontWeight: 600,
            borderBottom: '1px dotted rgb(58, 58, 58)',
          }}
        >
          पिता का नाम - {data.fatherName}
        </td>
      </tr>
      <tr>
        <td
          colSpan="3"
          style={{
            color: 'rgb(0, 0, 0)',
            fontWeight: 600,
            borderBottom: '1px dotted rgb(58, 58, 58)',
          }}
        >
          मोबाईल नं. - +91:{data.phoneNumber}
        </td>
      </tr>
      <tr>
        <td
          colSpan="3"
          style={{
            color: 'rgb(0, 0, 0)',
            fontWeight: 600,
          }}
        >
          पदयात्री का पता - {data.address}
        </td>
      </tr>
      <tr>
        <td
          colSpan="3"
          style={{
            textAlign: 'center',
            color: 'rgb(12, 0, 177)',
            fontWeight: 700,
            fontSize: '13px',
            borderTop: '2px solid black',
          }}
        >
          सम्पर्क सूत्र : 8696555530, 9887662860
        </td>
      </tr>
    </tbody>
  </table>
))}

      </div>
    </div>
  );
};

export default Form;
