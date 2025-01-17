import React from 'react'
import { BrowserRouter as Router, Routes, Route, Form } from "react-router-dom";

function AppForm() {
  return (
    // <div>AppForm</div>
    <Router>
    <Routes>
      <Route path="/" element={<Form/> {/* Form Page as the default */}
      <Route path="/passengers" element={<PassengerTable />} />
    </Routes>
  </Router>
  )
}

export default AppForm