import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "./healthlogo.png";

function OCRComponent() {
  const [logoutMessage, setLogoutMessage] = useState(null);
  const navigate = useNavigate();

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

  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUserData = () => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };
  const getPatientData = () => {
    const patientString = localStorage.getItem("patient");
    return patientString ? JSON.parse(patientString) : null;
  };
  const userData = getUserData();
  const patientData = getPatientData();

  const recordData = {
    userid: userData?.id || null,
    patientid: patientData?.id || null,
    data: "", // You might want to set this to an appropriate default value
    createdat: mysqlFormattedDateTime,
    updatedat: mysqlFormattedDateTime,
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("pdfFile", file);
    formData.append("mimeType", "application/pdf");
    try {
      setLoading(true);
      const response = await axios.post(
        "https://7p27mx-3001.csb.app/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Server Response:", response);
      setTextContent(response.data.textContent);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    recordData.data = textContent;

    try {
      const response = await fetch("https://hehe.scribify.store/add_record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recordData),
      });

      if (response.ok) {
        // If the response is successful, set the record in localStorage
        localStorage.setItem("record", JSON.stringify(recordData));
        console.log("successful add of record");
        // Navigate to the new URL
        navigate(`/Patient/${patientData.id}`);
      } else {
        console.error("Error submitting data. Server response not ok.");
        // Handle the error, if needed
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle the error, if needed
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
          <a
            className="list-group-item list-group-item-action list-group-item-light p-3"
            href="#!"
          >
            Records
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
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-6">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
          {error && (
            <div className="alert alert-danger mt-3">
              <p>{error}</p>
            </div>
          )}
          <div className="mt-3">
            <h3>Text Content:</h3>
            <pre className="border p-3">{textContent}</pre>
            <button onClick={handleSubmit} className="btn btn-primary">
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OCRComponent;
