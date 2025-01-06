
import React, { useState } from 'react';
import Form from './components/Form';
import IDCard from './components/IDCard';
import DownloadButton from './components/DownloadButton';
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
