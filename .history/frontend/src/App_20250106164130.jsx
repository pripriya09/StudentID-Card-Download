
import React, { useState } from 'react';

import './App.css';
import Form from './ID-CARD/Form';
import IDCard from './ID-CARD/IDCard';

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
      <Dp studentData={studentData} />
    </div>
  );
};

export default App;
