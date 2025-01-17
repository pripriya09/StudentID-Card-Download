import React from 'react'

function AppForm() {
  return (
    <div>AppForm</div>
    <Router>
    <Routes>
      <Route path="/" element={<FormPage />} /> {/* Form Page as the default */}
      <Route path="/passengers" element={<PassengerTable />} />
    </Routes>
  </Router>
  )
}

export default AppForm