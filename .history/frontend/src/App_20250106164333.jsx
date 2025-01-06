
import React, { useState } from 'react';
import Form from './ID-CARD/Form.jsx';
import IDCard from './ID-CARD/IDCard.jsx';
import DownloadButton from './ID-CARD/DownloadButton.jsx';
import './App.css';
const App = () => {
  const [studentData, setStudentData] = useState({
    name: '',
    fatherName: '',
    phoneNumber: '',
    registrationNumber: '',
  });

  return (
    <div className="App">
      <h1>Student ID Card Generator</h1>
      <Form setStudentData={setStudentData} />
      <IDCard studentData={studentData} />
      <DownloadButton studentData={studentData} />
    </div>
  );
};

export default App;
