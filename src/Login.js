import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./healthlogo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logoutMessage, setLogoutMessage] = useState(null); // Local state for logout message
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    // Send login data to the backend
    fetch("https://hehe.scribify.store/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Handle the response from the backend
        if (data.message === "Login successful") {
          return fetchUserData(email); // Return the promise from fetchUserData
        } else {
          console.log("Login failed");
          // Handle login failure if needed
        }
      })
      .then((userData) => {
        // Navigate to /Dashboard only if fetchUserData is successful
        if (userData) {
          navigate("/home");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors, e.g., display an error message to the user
      });
  };
  useEffect(() => {
    if (location.state?.logoutMessage) {
      // Set the logout message from location state when component mounts
      setLogoutMessage(location.state.logoutMessage);
    }
  }, [location.state?.logoutMessage]);

  useEffect(() => {
    // Set a timer to clear the logout message after 5 seconds
    const timeoutId = setTimeout(() => {
      setLogoutMessage(null);
    }, 5000);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, [logoutMessage]);

  const fetchUserData = async (email) => {
    try {
      const response = await fetch(
        "https://hehe.scribify.store/get_user_info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const userData = await response.json();
      console.log(userData);
      // Assuming userData is an object with first name, last name, role, and email
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error; // Rethrow the error to handle it in the calling code
    }
  };

  return (
    <div>
      <style>{`
      body {
        background-color: #f8f9fa;
        margin-top: 5rem;
      }

      .container {
        max-width: 400px; /* Adjust the max-width for responsiveness */
      }

      .card {
        border: none; /* Remove the border */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow */
      }

      .card-body {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .btn-primary {
        width: 100%; /* Make the button full-width */
        margin-top: 10px; /* Add some space between the inputs and the button */
      }
    `}</style>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column align-items-center mt-3">
                  <img src={logo} alt="Example" className="img-fluid" />
                  <span
                    className="mt-2"
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#007BFF",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    Scribify
                  </span>
                </div>
                {logoutMessage && <div>{logoutMessage}</div>}
                <form>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                  <p className="mt-3">
                    Don't have an account?{" "}
                    <a href="/Signup" className="btn btn-link">
                      Sign up here!
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
