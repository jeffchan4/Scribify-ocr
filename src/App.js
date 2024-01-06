import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Patient from "./Patient";
import Home from "./Home";
import OCRComponent from "./OCRComponent";
import Dashboard from "./Dashboard";
import CreatePatient from "./CreatePatient";
import Pt_record from "./Pt_record";
import Signup from "./Signup";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/patient/:id" element={<Patient />} />
        <Route path="/OCRComponent" element={<OCRComponent />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/CreatePatient" element={<CreatePatient />} />
        <Route path="/Pt_record/:id" element={<Pt_record />} />
        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

// Assuming you have a Layout component that you want to render on the "/" route

export default App;

