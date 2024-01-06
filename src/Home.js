// Home.js
import { React, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css"; // Import the CSS file
import logo from "./healthlogo.png";
import Dashboard from "./Dashboard";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const [logoutMessage, setLogoutMessage] = useState(null);
  const navigate = useNavigate();

  const getUserData = () => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };

  // Example usage
  const userData = getUserData();

  const logOut = () => {
    // // Assuming you're using the Fetch API or Axios for making HTTP requests
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

    // Clear local storage and navigate
    // setLogoutMessage("Logout successful");
    localStorage.clear();
    navigate("/", { state: { logoutMessage: "Logout successful" } });
    //     })
    //     .catch((error) => {
    //       // Handle errors, e.g., show an error message to the user
    //       console.error("Logout error:", error);
    //     });
    // };
  };

  const today = new Date();

  // Format the date as "YYYY-MM-DD" (you can customize the format as needed)
  const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

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

      {/* Page content wrapper */}
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

            <p
              className="mb-0"
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "8px",
              }}
            >
              {formattedDate}
            </p>

            <button onClick={logOut} className="ml-2 btn btn-danger">
              Logout
            </button>
          </div>
        </nav>

        {/* Page content */}
        <div className="container-fluid">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};
export default Home;
