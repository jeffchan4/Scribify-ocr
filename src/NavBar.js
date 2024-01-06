import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "./healthlogo.png";

const NavBar = () => {
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

    navigate("/Login", { state: { logoutMessage: "Logout successful" } });
  };

  const today = new Date();

  // Format the date as "YYYY-MM-DD" (you can customize the format as needed)
  const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  return (
    
      <div className="row">
        <nav className="navbar navbar-light bg-white flex-column align-items-start p-3 col-md-3">
          <div className="d-flex align-items-center mb-4">
            <img src={logo} alt="Logo" className="img-fluid logo-small mr-2" />
            <h1 style={{ margin: 0, fontSize: "1.1rem" }}>Scribify</h1>
          </div>

          <ul className="nav flex-column p-2">
            <li className="nav-item bg-light mb-2">
              <Link to="/" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li className="nav-item bg-light mb-2">
              <Link to="/Pt_record/3" className="nav-link">
                Records
              </Link>
            </li>
            <li className="nav-item bg-light mb-2">
              <span className="nav-link">Analytics</span>
            </li>
            <li className="nav-item bg-light mb-2">
              <span className="nav-link">Appointment</span>
            </li>
          </ul>
        </nav>

        <div className="col-md-9">
          <div className="d-flex align-items-center justify-content-between mt-4">
            {/* Add the search bar here */}
            <input type="text" placeholder="Search" className="mr-2" />

            <div>
              <div className="d-flex">
                <p className="mb-0 mr-2">{userData?.firstname}</p>
                <p className="mb-0">{userData?.lastname}</p>
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
        </div>
      </div>
    
  );
};

export default NavBar;
