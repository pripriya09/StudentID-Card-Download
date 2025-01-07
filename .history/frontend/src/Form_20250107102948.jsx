import React, { useState, useRef } from "react";

const IDCardGenerator = () => {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    phoneNumber: "",
  });
  const [userImage, setUserImage] = useState(null);
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImage(URL.createObjectURL(file)); // Preview URL for the uploaded image
    }
  };

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png"); // Convert canvas content to a PNG image
    link.download = "ID_Card.png";
    link.click();
  };

  const drawCanvas = () => {
    if (canvasRef.current && userImage) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw user image
      const img = new Image();
      img.src = userImage;
      img.onload = () => {
        ctx.drawImage(img, 20, 20, 100, 100); // Position and size for the image

        // Add text
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.fillText(`Name: ${formData.name}`, 140, 40);
        ctx.fillText(`Father's Name: ${formData.fatherName}`, 140, 70);
        ctx.fillText(`Phone: ${formData.phoneNumber}`, 140, 100);

        // Add a border for aesthetics
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
      };
    }
  };

  return (
    <div className="App">
      <h2>ID Card Generator</h2>

      {/* Form for user details */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          drawCanvas();
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Father's Name"
          value={formData.fatherName}
          onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        <button type="submit">Generate ID Card</button>
      </form>

      {/* Canvas for ID card */}
      <canvas ref={canvasRef} width="400" height="200" style={{ border: "1px solid #000", margin
