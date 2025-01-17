import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./MAIN-FORM/Form.jsx";
import PassengerTable from './MAIN-FORM/PassengerTable .jsx';

function AppForm() {
  return (
    // <div>AppForm</div>
    <Router>
    <Routes>
      <Route path="/" element={<Form/>}/> {/* Form Page as the default */}
      <Route path="/passengers" element={<PassengerTable/>} />
      <Route path="/cards" element={<Us} />

      
    </Routes>
  </Router>
  )
}

export default AppForm