import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./healthlogo.png";

const CreatePatient = () => {
  const [logoutMessage, setLogoutMessage] = useState(null);
  const navigate = useNavigate();

  const getUserData = () => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };

  // Example usage
  const userData = getUserData();

  const logOut = () => {
    setLogoutMessage("Logout successful");
    localStorage.clear();

    navigate("/", { state: { logoutMessage: "Logout successful" } });
  };

  const today = new Date();

  // Format the date as "YYYY-MM-DD" (you can customize the format as needed)
  const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  const getCurrentDateTimeForMySQL = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const [mysqlFormattedDateTime, setMysqlFormattedDateTime] = useState(
    getCurrentDateTimeForMySQL(),
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Update the datetime every second
      setMysqlFormattedDateTime(getCurrentDateTimeForMySQL());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Run this effect only once on component mount

  const [formData, setFormData] = useState({
    userid: userData.id,
    firstname: "",
    lastname: "",
    DOB: "",
    sex: "", // Updated to include a sex field
    createdat: mysqlFormattedDateTime,
    updatedat: mysqlFormattedDateTime,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://hehe.scribify.store/new_patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        // Redirect to a certain route on successful response

        const patientData = result.patient_data;

        console.log(patientData);
        localStorage.setItem("patient", JSON.stringify(patientData));
        // const patientInfo = JSON.stringify(patientData);
        // // Parse the string back into a JavaScript object
        // const parsedPatientInfo = JSON.parse(patientInfo);
        // // Access the 'id' property
        const patientId = patientData.id;

        // Navigate to a dynamic route with patientId
        navigate(`/Patient/${patientId}`);
      } else {
        // Handle error scenarios, e.g., display an error message
        console.error(
          "Failed to create patient:",
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      console.error("Error during POST request:", error);
    }
  };

  return (
    <div className="d-flex" id="wrapper">
      {/* Sidebar */}
      <div className={`border-end bg-white`} id="sidebar-wrapper">
        <div className="sidebar-heading border-bottom bg-light d-flex align-items-center">
          <img
            src={logo}
            style={{ width: "50px", height: "50px" }}
            alt="Example"
            className="img-fluid mr-2"
          />
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#007BFF",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
              margin: 5,
            }}
          >
            Scribify
          </h1>
        </div>

        <div className="list-group list-group-flush">
          <a
            className="list-group-item list-group-item-action list-group-item-light p-3"
            href="/home"
          >
            Dashboard
          </a>
        </div>
      </div>

      <div id="page-content-wrapper">
        {/* Top navigation */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
          <div className="container-fluid">
            <div className="d-flex flex-column">
              <div className="d-flex">
                <p className="mb-0 mr-2">
                  {userData?.firstname} {userData?.lastname}
                </p>
              </div>

              <div className="d-flex">
                <p className="mb-0">
                  <strong>{userData?.role}</strong>
                </p>
              </div>
            </div>

            <p className="mb-0">{formattedDate}</p>
            <button onClick={logOut} className="ml-2 btn btn-danger">
              Logout
            </button>
          </div>
        </nav>

        {/* Create Patient Section */}
        <div className="mx-4">
          <h2 className="mb-4 mt-4">Create Patient</h2>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstname">Firstname:</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstname"
                  placeholder="Firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="lastname">Lastname:</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastname"
                  placeholder="Lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label htmlFor="DOB">Date of Birth:</label>
                <input
                  type="date"
                  className="form-control"
                  id="DOB"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="sex">Sex:</label>
                <select
                  className="form-control"
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreatePatient;
