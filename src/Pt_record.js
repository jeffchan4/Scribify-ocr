// Patient.js
import { React, useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import logo from "./healthlogo.png";

const Pt_record = () => {
  const { id } = useParams();
  const [recordData, setRecordData] = useState(null);
  const [logoutMessage, setLogoutMessage] = useState(null);
  const navigate = useNavigate();

  const getUserData = () => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };
  const getPatientData = () => {
    const patientString = localStorage.getItem("patient");
    return patientString ? JSON.parse(patientString) : null;
  };
  const patientData = getPatientData();

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

  useEffect(() => {
    const fetchDataRecord = async () => {
      try {
        const response = await fetch(
          "https://hehe.scribify.store/fetch_data_record",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ record_id: id }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch record data");
        }

        const data = await response.json();
        setRecordData(data.records);
      } catch (error) {
        console.error("Error fetching record data:", error.message);
      }
    };

    // Fetch data when the component mounts or when id changes
    if (id) {
      console.log(id);
      fetchDataRecord();
    }
  }, [id]); // The dependency array ensures the effect runs when id changes

  const deleteRecord = async () => {
    try {
      console.log(id);
      const response = await fetch(
        "https://hehe.scribify.store/delete_record",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ record_id: id }),
        },
      );

      if (!response.ok) {
        // Handle non-successful response
        console.error(`Error: ${response.status} - ${response.statusText}`);
        // Optionally, you can throw an error or handle the response based on your requirements
        throw new Error("Failed to delete record");
      }

      const data = await response.json();
      console.log(data.message); // Log the success message from the server
      navigate(`/patient/${patientData.id}`);
      // Optionally, you can perform additional actions after a successful delete
    } catch (error) {
      // Handle errors that occur during the fetch or JSON parsing
      console.error("Error:", error.message);
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

        <div className="d-flex">
          <div className="flex-grow-1 p-4">
            <div id="pt-info-container" className="my-4 p-4 border rounded">
              <h2 className="mb-3">
                {patientData.firstname} {patientData.lastname}
              </h2>
              <p className="mb-2">MRN: {patientData.id}</p>
              <p className="mb-2">DOB: {patientData.DOB}</p>
              <p className="mb-2">Sex: {patientData.sex}</p>
            </div>

            <div id="edit-record" className="my-4 p-4 border rounded">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="mb-0">Medical Record</h2>
                  <button className="btn btn-danger" onClick={deleteRecord}>
                    Delete
                  </button>
                </div>
                {recordData && (
                  <div>
                    <pre>{recordData[0].data}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pt_record;
