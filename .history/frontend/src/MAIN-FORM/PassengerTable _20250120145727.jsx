import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./App.css";

const PassengerTable = () => {
  const [passengers, setPassengers] = useState([]);
  const [error, setError] = useState("");
  const [selectedPassenger, setSelectedPassenger] = useState(null); // Track selected passenger

  useEffect(() => {
    axios
      .get("http://localhost:6009/api/students")
      .then((response) => {
        console.log("API Response:", response.data);
        setPassengers(response.data.allstudents);
      })
      .catch((err) => {
        setError("Failed to fetch passengers.");
        console.error(err);
      });
  }, []);

  const handleDownloadPDF = (passengerId) => {
    const passenger = passengers.find((p) => p._id === passengerId);
    setSelectedPassenger(passenger);
  
    const pdf = new jsPDF();
    const idCard = document.createElement("div"); // Create ID card dynamically
    idCard.id = `id-card-${passenger._id}`;
    idCard.style.position = "absolute";
    idCard.style.left = "-9999px"; // Make it off-screen
    idCard.style.top = "-9999px"; // Make it off-screen
    idCard.style.width = "400px";  // Set a specific width for the card
    idCard.style.height = "250px"; // Set a specific height for the card
  
    idCard.innerHTML = `
     <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>sawadar samiti</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
    <style>
        body {
            background-color: #fff7f7;
            font-family: "Poppins", serif;
            margin: 0;
            padding: 0;
        }

        table {
            position: relative;
            width: 350px;
            height: 100%;
            background: #ffecec;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }

        .profile-img {
            width: 80px;
            object-fit: fill;
            height: 80px;
            border: solid 2px rgb(133, 46, 46);
            margin-left: 10px;
        }

        td {
            padding: 0px;
            margin: 0px;
        }

        .center-text {
            text-align: center;
        }

        .bold-text {
            font-weight: 700;
        }

        .large-text {
            font-size: 13px;
        }

        .extra-large-text {
            font-size: 18px;
        }

        .huge-text {
            font-size: 28px;
        }

        .filter-shadow {
            filter: drop-shadow(2px 1px 1px rgb(255, 230, 7));
        }
    </style>
</head>

<body>
    <table>
        <tbody>
            <tr>
                <td style="color:red; font-weight: 700;text-align: center;font-size: 10px;float: inline-start;">॥ श्री
                    खाटू श्याम देवाय नमः ॥</td>
                <td colspan="2" class="center-text"
                    style="color: rgb(0, 0, 206); font-weight: 700;font-size: 10px; float: inline-end;">रजि. नं. :
                    COOPI2024 / JAIPURI206591</td>
            </tr>

            <tr>
                <td colspan="3" class="center-text"
                    style="color: rgb(255, 0, 0); font-weight: 900; font-size: 26px; filter: drop-shadow(2px 1px 1px rgb(255, 230, 7));">
                    श्री खाटू श्याम सेवादार समिति</td>
            </tr>
            <tr>
                <td colspan="3" class="center-text" style="color: rgb(0, 0, 0);font-size: 12px;font-weight: 600;">
                    ए बी 468, दूसरी मंजिल, निर्माण नगर, किंग्स रोड़, अजमेर रोड़, जयपुर मो- 8905902495
                </td>
            </tr>
            <tr>
                <td colspan="3" class="center-text"
                    style="color: rgb(255, 0, 43); font-weight: 700; font-size: 15px;text-align: center; ">
                    रींगस से खाटूधाम पदयात्रा (दिनांक- 13 फरवरी 2025)
                </td>
            </tr>
            <table>
                <tr>
                    <td colspan="2" rowspan="4"><img src="./shyam.jpg" class="profile-img" alt=""></td>
                    <td colspan="2" class="large-text"
                        style="color: rgb(0, 0, 0); font-weight: 600;border-bottom: dotted 1px rgb(58, 58, 58);padding-left: 10px;">
                        रजिस्ट्रेशन नं. - 354354656</td>
                </tr>
                <tr>
                    <td colspan="2" class="large-text"
                        style="color: rgb(0, 0, 0); font-weight: 600;border-bottom: dotted 1px rgb(58, 58, 58);padding-left: 10px;">
                        पदयात्री का नाम - Pradeep Kumar</td>
                </tr>
                <tr>
                    <td colspan="2" class="large-text"
                        style="color: rgb(0, 0, 0); font-weight: 600;border-bottom: dotted 1px rgb(58, 58, 58);padding-left: 10px;">
                        मोबाईल नं. - +91 1234567890</td>
                </tr>
                <tr>
                    <td colspan="2" class="large-text"
                        style="color: rgb(0, 0, 0); font-weight: 600;padding-left: 10px;">पदयात्री का पता - Kesar Nagar
                    </td>
                </tr>
            </table>
            <table>
                <tr>
                    <td colspan="3" class="center-text"
                        style="color: rgb(12, 0, 177); font-weight: 700; font-size: 13px;border-top: solid 2px black;">
                        सम्पर्क सूत्र : 8696555530, 9887662860, 9828156963,
                        6376999432, 9314476414, 9828256321, 9782676365
                    </td>
                </tr>
            </table>
        </tbody>
    </table>
</body>

</html>
    `;
  
    // Append the ID card to the DOM (off-screen)
    document.body.appendChild(idCard);
  
    // Generate the PDF
    html2canvas(idCard).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 10, 10, 180, 100); // Adjust the width and height here
      pdf.save(`${passenger.name}_ID_Card.pdf`);
  
      // Clean up by removing the ID card after PDF generation
      document.body.removeChild(idCard);
    });
  };
  

  const handleEditPassenger = (passengerId) => {
    const passengerToEdit = passengers.find((p) => p._id === passengerId);
    console.log("Edit passenger:", passengerToEdit);
    // Implement the edit logic (e.g., show a form with the passenger details)
  };

  const handleDeletePassenger = (passengerId) => {
    if (window.confirm("Are you sure you want to delete this passenger?")) {
      // Call the backend to delete the passenger
      axios
        .delete(`http://localhost:6009/api/students/${passengerId}`)
        .then(() => {
          setPassengers((prevPassengers) =>
            prevPassengers.filter((p) => p._id !== passengerId)
          );
        })
        .catch((err) => {
          console.error("Failed to delete passenger:", err);
        });
    }
  };
  
  

  return (
    <div>
      <h1>Passenger Details</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

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
            <th>Image</th>
            <th>Payment Status</th>
            <th>Action</th>
            <th>Download PDF</th>
          </tr>
        </thead>
        <tbody>
          {passengers && passengers.length > 0 ? (
            passengers.map((passenger) => (
              <React.Fragment key={passenger._id}>
                <tr>
                  <td>{passenger.registrationNumber}</td>
                  <td>{passenger.name}</td>
                  <td>{passenger.fatherName}</td>
                  <td>{passenger.phoneNumber}</td>
                  <td>{passenger.address}</td>
                  <td>{passenger.disease}</td>
                  <td>{passenger.reference}</td>
                  <td>
                    <img
                      src={passenger.image}
                      alt="Profile"
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    />
                  </td>
                  <td></td>
                  <td>
                    <button onClick={() => handleEditPassenger(passenger._id)}>Edit</button>
                    <button onClick={() => handleDeletePassenger(passenger._id)}>Delete</button>
                  </td>
                  <td>
                    <button onClick={() => handleDownloadPDF(passenger._id)}>
                      Download PDF
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="9">No passengers available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerTable;
