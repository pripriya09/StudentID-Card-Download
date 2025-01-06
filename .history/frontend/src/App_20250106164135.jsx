
import React, { useState } from 'react';

import './App.css';
import Form from './ID-CARD/Form';
import IDCard from './ID-CARD/IDCard';
import DownloadButton from './ID-CARD/DownloadButton';

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
