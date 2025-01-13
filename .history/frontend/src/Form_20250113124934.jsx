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
        const { name, fatherName, phoneNumber, address, image, consent, disease, reference } = data;
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
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  const handleDownloadPDF = () => {
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
          <div key={index} className="student_id">
            <div className="top_section">
              <div className="profile_photo">
                <img
                  src={
                    data.image ||
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAM1BMVEUKME7///+El6bw8vQZPVlHZHpmfpHCy9Ojsbzg5ekpSmTR2N44V29XcYayvsd2i5yTpLFbvRYnAAAJcklEQVR4nO2d17arOgxFs+kkofz/154Qmg0uKsuQccddT/vhnOCJLclFMo+//4gedzcApf9B4srrusk+GsqPpj+ypq7zVE9LAdLWWVU+Hx69y2FMwAMGyfusLHwIpooyw9IAQfK+8naDp3OGHvZ0FMhrfPMgVnVjC2kABOQ1MLvi0DEIFj1ILu0LU2WjNRgtSF3pKb4qqtd9IHmjGlJHlc09IHlGcrQcPeUjTAySAGNSkQlRhCCJMGaUC0HSYUx6SmxFAtJDTdylsr4ApC1TY0yquKbCBkk7qnYVzPHFBHkBojhVJWviwgPJrsPwbqb1F6VDA0mhhAq1X3rIxlZ20V3gRv/MuRfchfiwvzUp6Bdug3Qs0UGx6vMlY15QUa8tHl7CG2GdH5m+m9Y88cYcn/ZqksZ9gHlL9PMosFFNh67REoaD3cB6brRNo5MABmKwPbErLq0Kn2R9X9KtmHtHewHuw5hQF4Tk7rzM4e+JfdlZcAB45Yk30rbmu3MZpc2ScUS7S+Jm0fzZ1EqGkCfa5LijHtO0m0dpFNOoD02AfZwVnkH5sC6ZsYqRlCRcq2s13g=="
                  }
                  alt="Profile"
                  style={{ height: "50px", width: "50px", objectFit: "cover" }}
                />
              </div>
              <div className="student_id_number">
                <div className="id_number">
                  {data.registrationNumber || "Registration Number"}
                </div>
                <div className="passenger_name">
                  {data.name || "Name"}
                </div>
              </div>
            </div>
            <div className="middle_section">
              <div className="father_name">Father: {data.fatherName || "Father's Name"}</div>
              <div className="address">Address: {data.address || "Address"}</div>
              <div className="phone_number">
                Phone: {data.phoneNumber || "Phone Number"}
              </div>
              <div className="disease">Disease: {data.disease || "Disease"}</div>
              <div className="reference">
                Reference: {data.reference || "Reference Name & Mobile"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Form;
