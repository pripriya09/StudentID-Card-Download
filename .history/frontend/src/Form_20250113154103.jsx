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
    const idCardElements = document.querySelectorAll(".student_id");
  
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
                <th>Passenger</th>
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
                  <td>Passenger {index + 1}</td>
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
          <>
            {" "}
            <h3>passanger {index + 1}</h3>
            <div key={index} className="student_id">
              <div className="top_section">
                <div className="profile_photo">
                  <img
                    src={
                      data.image ||
                      "data:image/png;base64,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"
                    }
                    alt={`Passenger ${index + 1}`}
                  />
                </div>
                <div className="student_name">
                  <ul className="student_info">
                    <li className="name"></li>
                  </ul>
                  <p>Name - {data.name}</p>
                  <p>Father's Name - {data.fatherName}</p>
                  <p>Phone Number - {data.phoneNumber}</p>
                  <p>Address - {data.address}</p>
                  <p>Reg. No. - {data.registrationNumber}</p>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default Form;
