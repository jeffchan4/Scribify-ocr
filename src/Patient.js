import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "./healthlogo.png";

import makeSummarizationRequest from "./openai";

const Patient = () => {
  const sentences = 5;
  const apiKey = "be38a8eccc9c717b0341338e4d76f761";
  const [logoutMessage, setLogoutMessage] = useState(null);
  const [summary, setSummary] = useState("");
  const navigate = useNavigate();

  const logOut = () => {
    // Assuming you're using the Fetch API or Axios for making HTTP requests
    // fetch("https://7p27mx-3001.csb.app/logout", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   // You can include additional data in the request body if needed
    //   // body: JSON.stringify({ additionalData: 'some value' }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     // Handle the server response, e.g., show a message to the user
    //     console.log(data.message);

    //     // Clear local storage and navigate
    //     setLogoutMessage("Logout successful");
    localStorage.clear();
    navigate("/", { state: { logoutMessage: "Logout successful" } });
    // })
    // .catch((error) => {
    //   // Handle errors, e.g., show an error message to the user
    //   console.error("Logout error:", error);
    // });
  };

  const today = new Date();

  // Format the date as "YYYY-MM-DD" (you can customize the format as needed)
  const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  const [records, setRecords] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://hehe.scribify.store/fetch_record",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userid: userData.id,
              patientid: patientData.id,
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          // console.log("this is data");
          // console.log(data);
          // console.log("this is data.records");
          // console.log(data.records);
          if (data.records) {
            setRecords(data.records);
          }
        } else {
          console.error("Error fetching records. Server response not ok.");
        }
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchData();
  }, [userData.id, patientData.id]);
  useEffect(() => {
    console.log(patientData);
    console.log(records); // Logs the updated state
  }, [records]);

  const getFirstThreeWords = (data) => {
    // Split the string into an array of wordsß
    const words = data.split(" ");

    // Take the first three words and join them back into a string
    const firstThreeWords = words.slice(0, 3).join(" ");

    return firstThreeWords;
  };

  const fetchData = async () => {
    try {
      const textToSummarize = records.map((dictionary) => dictionary["data"]);

      const result = await makeSummarizationRequest(
        textToSummarize,
        sentences,
        apiKey,
      );

      setSummary(result);

      console.log("Received summary:", result);
    } catch (error) {
      console.error("Error in summarization request:", error);
    }
  };

  const handleButtonClick = () => {
    fetchData();
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

        <div className="d-flex">
          <div className="flex-grow-1 p-4">
            {/* Patient Information Container */}
            <div className="container mt-4">
              <div id="pt-info-container" className="card p-3">
                <h2>
                  {patientData.firstname} {patientData.lastname}
                </h2>
                <p>MRN: {patientData.id}</p>
                <p>DOB: {patientData.DOB}</p>
                <p>Sex: {patientData.sex}</p>
              </div>
            </div>

            {/* Patient History Container */}
            <div className="container mt-4">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title">Patient History</h2>
                  <p className="card-text">{summary}</p>
                  <button
                    className="btn btn-success btn-lg"
                    onClick={handleButtonClick}
                    style={{ marginTop: "10px" }}
                  >
                    Summarize
                  </button>{" "}
                </div>
              </div>
            </div>
            <div
              id="pt-records-container"
              className="container mt-4"
              style={{
                border: "1px solid #ddd", // Border color and thickness
                borderRadius: "8px", // Border radius for smooth corners
                padding: "15px", // Padding inside the container
              }}
            >
              <h2 className="mb-3">Patient Records</h2>

              <Link to="/OCRComponent">
                <button className="btn btn-primary mb-3">Add Record</button>
              </Link>

              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">PT Records</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {records.map((record) => (
                      <li key={record.id} className="list-group-item">
                        <Link
                          to={`/Pt_record/${record.id}`}
                          className="card-link"
                        >
                          <strong>Record ID:</strong> {record.id} <br />
                          <strong>Date:</strong> {record.createdat} <br />
                          <strong>Title:</strong>{" "}
                          {getFirstThreeWords(record.data)} <br />
                          {/* Add other properties you want to display */}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patient;
