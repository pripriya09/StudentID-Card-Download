import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import axios from "axios";
import jsPDF from "jspdf";
import "./App.css";
import { useNavigate } from "react-router-dom";
const Form = () => {
  const [count, setCount] = useState(1); // Number of passengers
  const [consent, setConsent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if the form is successfully submitted
  const [formData, setFormData] = useState(
    Array.from({ length: 1 }, () => ({
      name: "",
      fatherName: "",
      phoneNumber: "",
      address: "",
      image: null,
      disease: "",
      reference: "",
      registrationNumber: "", // Add a registration number field
    }))
  );
  const [idCardData, setIdCardData] = useState(null);
  const fileInputRefs = useRef([]);
  const navigate = useNavigate();
  const handlePassengerButtonClick = () => {
    navigate("/passengers"); // Navigate to the PassengerTable page
  };
  const handleCountChange = (e) => {
    let value = parseInt(e.target.value, 10);
  
    // Ensure value is within range 1 to 10
    if (value < 1) {
      value = 1;
    } else if (value > 10) {
      value = 10;
    }
  
    // Update state
    setCount(value);
  
    // Update the formData array to match the new count
    setFormData((prev) =>
      Array.from({ length: value }, (_, i) => prev[i] || {
        name: "",
        fatherName: "",
        phoneNumber: "",
        address: "",
        image: "",
        disease: "",
        reference: "",
        registrationNumber: "",
      })
    );
  };
  

  const handleChange = (index, e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => {
      const updatedData = [...prevData];
      if (type === "file") {
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
    if (!consent) {
      alert("Please provide consent for registration.");
      return;
    }
    try {
      const formDataToSubmit = formData.map((data) => {
        const {
          name,
          fatherName,
          phoneNumber,
          address,
          image,
          consent,
          disease,
          reference,
        } = data;
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
        consent: consent,
      });

      if (response.status === 200) {
        alert("Passengers registered successfully.");
        console.log("Response Data:", response.data);

        setFormData((prevData) =>
          prevData.map((data, index) => ({
            ...data,
            registrationNumber: response.data.registrationNumbers[index],
          }))
        );

        // Mark the form as successfully submitted
        setIsSubmitted(true);
      } else {
        alert("Failed to register passengers. Please try again.");
      }

      setIdCardData(formData);
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
  
      // Reset form to default state after download
      setFormData([
        {
          name: "",
          fatherName: "",
          phoneNumber: "",
          address: "",
          disease: "",
          reference: "",
          image: null,
          registrationNumber: "",
        },
      ]);
      setConsent(false); // Reset consent checkbox
      setCount(1); // Set passenger count back to 1
  
      // Reset file inputs (clear image fields)
      if (fileInputRefs.current) {
        fileInputRefs.current.forEach((ref) => (ref.value = "")); // Clear file inputs
      }
      setIsSubmitted(false); 
    });
  };
  

  return (
    <div className="maincontainer">
      <div className="header"></div>
      <div className="App content">
        <div className="header-pic">
          <img src="/khatu-shyam-banner.jpg" alt="" />
        </div>
        <div className="header-txt">
        <h1>श्री खाटू श्याम सेवादार समिति, जयपुर - रजि.</h1>
        <p>विशाल द्वितीय निशान यात्रा रिंगस से खाटू धाम, 13 फरवरी 2025 को श्री खाटू श्याम बाबा की भव्य और विराट पैदल निशान यात्रा का आयोजन किया जा रहा है। यात्रा बस द्वारा रींगस तक पहुंचेगी, और वहां से निशान के साथ पैदल यात्रा शुरू होगी। यह यात्रा आपके लिए बाबा श्याम की कृपा और आशीर्वाद का एक अनमोल अवसर है।</p>
        </div>
        <div className="passanger-count">
        <label>
          Number of Passengers :
          <input
  type="number"
  min="1"
  max="10"
  value={count}
  onChange={handleCountChange}
  onInput={(e) => {
    let value = e.target.value;
    value = value.replace(/^0+/, "");
    if (value === "" || isNaN(value)) {
      setCount(""); 
    } else {
      const numericValue = Math.min(Math.max(parseInt(value, 10), 1), 10); 
      if(numericValue>10){
   alert("only 10 passengers are allowed")
      }
      
      setCount(numericValue);
    }
  }}
  required
/>
</label>
<button type="button" onClick={handlePassengerButtonClick}>
          Passengers
        </button>
</div>
        <form onSubmit={handleSubmit}>
          {formData.map((data, index) => (
            <div key={index} className="passenger-form">
              <h2>Passenger {index + 1}</h2>
              <div className="form-field">
                <label htmlFor={`name-${index}`}>Name</label>
                <input
                  type="text"
                  name="name"
                  id={`name-${index}`}
                  placeholder="Name"
                  value={data.name}
                  onChange={(e) => handleChange(index, e)}
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor={`fatherName-${index}`}>Father's Name</label>
                <input
                  type="text"
                  name="fatherName"
                  id={`fatherName-${index}`}
                  placeholder="Father's Name"
                  value={data.fatherName}
                  onChange={(e) => handleChange(index, e)}
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor={`phoneNumber-${index}`}>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id={`phoneNumber-${index}`}
                  placeholder="Phone Number"
                  value={data.phoneNumber}
                  onChange={(e) => handleChange(index, e)}
                  pattern="\d{10}"
                  title="Phone number must be 10 digits / only number allowed"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor={`image-${index}`}>Image</label>
                <input
                  type="file"
                  name="image"
                  id={`image-${index}`}
                  onChange={(e) => handleChange(index, e)}
                  ref={(el) => (fileInputRefs.current[index] = el)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor={`address-${index}`}>Address</label>
                <input
                  type="text"
                  name="address"
                  id={`address-${index}`}
                  placeholder="Address"
                  value={data.address}
                  onChange={(e) => handleChange(index, e)}
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor={`disease-${index}`}>Disease (if any)</label>
                <input
                  type="text"
                  name="disease"
                  id={`disease-${index}`}
                  value={data.disease}
                  onChange={(e) => handleChange(index, e)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor={`reference-${index}`}>Reference (Name & Mobile)</label>
                <input
                  type="text"
                  name="reference"
                  id={`reference-${index}`}
                  value={data.reference}
                  onChange={(e) => handleChange(index, e)}
                  required
                />
              </div>
            </div>
          ))}

          <label className="centered-consent">
            <div className="agreement-text">
              <span>
                I provide consent for all passengers and agree to the following terms:
              </span>
              <p><strong>🌟 श्री खाटू श्याम बाबा की विराट पैदल निशान यात्रा के नियम और दिशानिर्देश 🌟</strong></p>
              <ol>
                <li>यात्रा की संपूर्ण जिम्मेदारी स्वयं यात्री की होगी।</li>
                <li>60 वर्ष से अधिक आयु के व्यक्ति के साथ उनके परिचारक का होना अनिवार्य है।</li>
                <li>बच्चों की पूरी जिम्मेदारी उनके अभिभावकों की होगी।</li>
                <li>बच्चे के लिए सीट लेने पर पूर्ण शुल्क का भुगतान करना पड़ेगा।</li>
                <li>समिति के निर्देशों का पालन अनिवार्य है। यात्रा के दौरान समिति द्वारा समय-समय पर निर्देश जारी किए जाएंगे, जिनका पालन करना सभी यात्रियों के लिए आवश्यक होगा।</li>
                <li>कृपया अपना व्हाट्सएप नंबर अवश्य प्रदान करें।</li>
                <li>यात्रा के दौरान अल्पाहार की व्यवस्था रहेगी, और निशान यात्रा के पश्चात भोजन प्रसादी की व्यवस्था की जाएगी।</li>
                <li>अपनी सभी आवश्यक दवाइयां अपने साथ लेकर आएं।</li>
                <li>हमारी संस्था किसी भी निजी स्वार्थ के लिए कार्य नहीं करती है। यदि किसी अन्य व्यक्ति द्वारा संस्था के नाम पर आपसे किसी प्रकार का धन मांगा जाए, तो उसकी सूचना तुरंत दें।</li>
                <li>निशान यात्रा रींगस मोड़ से प्रारंभ होकर बाबा के भवन तक पहुंचेगी।</li>
                <li>किसी भी यात्री को परेशानी होने पर समिति के व्यक्ति को सूचित करें या 100 नंबर पर कॉल करें।</li>
                <li>यात्रा के दौरान किसी भी प्रकार के मादक पदार्थों का सेवन पूर्णतः वर्जित है।</li>
                <li>वापसी के समय सभी यात्री निर्धारित स्थान और समय पर ही रवाना होंगे।</li>
                <li>यात्रा के दौरान कीमती सामान या अधिक नकदी न ले जाएं। किसी भी दुर्घटना की स्थिति में आयोजक जिम्मेदार नहीं होंगे।</li>
                <li>किसी भी परिस्थिति में सहयोग राशि वापस नहीं की जाएगी।</li>
                <li>बस में सीट पहले आओ, पहले पाओ के आधार पर ही दी जाएगी।</li>
                <li>यात्रा का प्रस्थान सुबह 7:15 बजे , स्थान: समुराई गार्डन, श्याम नगर पुलिस थाने के पास, निर्माण नगर, जयपुर।</li>
                <li>सभी विवादों का निवारण जयपुर न्याय क्षेत्र में ही होगा।</li>
              </ol>
              <p>🙏 यात्रा को सफल और मंगलमय बनाने में सभी का सहयोग अपेक्षित है।</p>

              <div className="terms">
                <input
                  type="checkbox"
                  name="consent"
                  checked={consent}
                  onChange={() => setConsent(!consent)}
                  required
                />
                <p>मैंने सभी नियमों और दिशा-निर्देशों को ध्यानपूर्वक पढ़ लिया है और मैं इनका पूरी निष्ठा और अनुशासन के साथ पालन करूंगा/करूंगी।</p>
              </div>
              <button type="submit">Register Passengers</button>
            </div>
          </label>
        </form>

        <div className="download-pdf">
          <button className="id-print-btn" onClick={handleDownloadPDF}>
            Download Card in PDF
          </button>
        </div>

        {/* Display ID Card after Successful Submission */}
        {isSubmitted && formData.map((data, index) => (
 import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

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

  // Function to generate the PDF
  const generatePDF = (data) => {
    const doc = new jsPDF();

    // Add table header and details to the PDF
    doc.setFontSize(12);

    // First Row
    doc.setTextColor('red');
    doc.setFontSize(10);
    doc.text('॥ श्री खाटू श्याम देवाय नमः ॥', 10, 10);
    doc.setTextColor('rgb(0, 0, 206)');
    doc.text('रजि. नं. : COOPI2024 / JAIPURI206591', 150, 10, { align: 'right' });

    // Title Row
    doc.setTextColor('rgb(255, 0, 0)');
    doc.setFontSize(26);
    doc.text('श्री खाटू श्याम सेवादार समिति', 105, 25, { align: 'center' });

    // Address Row
    doc.setTextColor('rgb(0, 0, 0)');
    doc.setFontSize(12);
    doc.text('ए बी 468, दूसरी मंजिल, निर्माण नगर, किंग्स रोड़, अजमेर रोड़, जयपुर मो- 8905902495', 105, 40, { align: 'center' });

    // Event Row
    doc.setTextColor('rgb(255, 0, 43)');
    doc.setFontSize(15);
    doc.text('रींगस से खाटूधाम पदयात्रा (दिनांक- 13 फरवरी 2025)', 105, 50, { align: 'center' });

    // ID Card Details Section
    // Profile Image Column
    if (data.image) {
      const img = new Image();
      img.src = data.image;
      img.onload = () => {
        doc.addImage(img, 'JPEG', 10, 60, 50, 50); // Adjust image size and position
        generateTextFields();
        doc.save(`${data.registrationNumber}.pdf`);
      };
    } else {
      generateTextFields();
      doc.save(`${data.registrationNumber}.pdf`);
    }

    // Function to generate text fields after image loading
    const generateTextFields = () => {
      // Registration Number Row
      doc.setTextColor('rgb(0, 0, 0)');
      doc.setFontSize(12);
      doc.text(`रजिस्ट्रेशन नं. - ${data.registrationNumber}`, 70, 60);

      // Name Row
      doc.text(`पद्याती का नाम - ${data.name}`, 70, 70);

      // Father's Name Row
      doc.text(`पिता का नाम - ${data.fatherName}`, 70, 80);

      // Phone Number Row
      doc.text(`पदयात्री मोबाइल नं. - ${data.phoneNumber}`, 70, 90);

      // Address Row
      doc.text(`पदयात्री का पता - ${data.address}`, 70, 100);

      // Contact Information Row
      doc.setTextColor('rgb(12, 0, 177)');
      doc.setFontSize(13);
      doc.text('सम्पर्क सूत्र : 8696555530, 9887662860, 9828156963, 6376999432, 9314476414, 9828256321, 9782676365', 105, 120, { align: 'center' });
    };
  };

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
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((passenger, index) => (
            <tr key={index}>
              <td>{passenger.name}</td>
              <td>{passenger.fatherName}</td>
              <td>{passenger.phoneNumber}</td>
              <td>{passenger.address}</td>
              <td>{passenger.disease}</td>
              <td>{passenger.reference}</td>
              <td>
                <img
                  src={passenger.image || './shyam.jpg'}
                  alt={passenger.name}
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              </td>
              <td>{passenger.registrationNumber}</td>
              <td>
                <button onClick={() => generatePDF(passenger)}>
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerTable;

))}

      </div>
    </div>
  );
};

export default Form;
