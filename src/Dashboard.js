import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

const Dashboard = () => {
  const getUserData = () => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };

  const [patients, setPatients] = useState([]);
  const userData = getUserData();

  useEffect(() => {
    const getPatients = async () => {
      try {
        if (!userData || !userData.id) {
          console.error("User data or user ID is missing.");
          return;
        }

        const response = await fetch(
          "https://hehe.scribify.store/fetch_patients_of_user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userData.id }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    getPatients();
  }, [userData]);
  const handlePatientClick = (patient) => {
    // Set patient information in localStorage

    localStorage.setItem("patient", JSON.stringify(patient));

    const getPatientData = () => {
      const patientString = localStorage.getItem("patient");
      return patientString ? JSON.parse(patientString) : null;
    };

    const patientData = getPatientData();
  };
  return (
    <div>
      <div className="container col-md-10 mr-4">
        <h1 className="text-center mt-4">Patient Registry</h1>

        <div className="d-flex justify-content-between align-items-center mb-2">
        <p className="mb-0 text-lg">Total Patients ({patients.length})</p>

          <Link to="/CreatePatient">
            <button className="btn btn-primary">Add Patient</button>
          </Link>
        </div>

        <ul className="list-group">
  {patients.map((patient) => (
    <Link
      key={patient.id}
      to={`/patient/${patient.id}`}
      onClick={() => handlePatientClick(patient)}
      className="link-primary d-inline text-decoration-none" // Added text-decoration-none class
    >
      <li className="list-group-item d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column">
          <strong>MRN:</strong>
          {patient.id}
        </div>

        <div className="d-flex flex-column">
          <strong>Name:</strong>
          {`${patient.firstname} ${patient.lastname}`}
        </div>

        <div className="d-flex flex-column">
          <strong>DOB:</strong>
          {patient.DOB.split("T")[0]}
        </div>

        <div className="d-flex flex-column">
          <strong>Sex:</strong>
          {patient.sex}
        </div>
      </li>
    </Link>
  ))}
</ul>

      </div>
    </div>
  );
};

export default Dashboard;
