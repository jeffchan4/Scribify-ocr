const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { readFileSync } = require("fs");
const { DocumentProcessorServiceClient } =
  require("@google-cloud/documentai").v1;
const multer = require("multer");
const mysql = require("mysql");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Replace 'path/to/keyfile.json' with the path to your service account key file.
const keyFilename = "./key.json"; // Update to the actual path to your service account key file.

// Read the contents of the service account key file
const keyFileContents = readFileSync(keyFilename, "utf8");
const keyFile = JSON.parse(keyFileContents);

// Create a client using the service account key
const client = new DocumentProcessorServiceClient({
  credentials: keyFile,
});

dbConfig = {
  host: "database-1.cy10b3zy7cdy.us-east-1.rds.amazonaws.com",
  port: "3306",
  user: "admin",
  password: "password",
  database: "my_db",
};

const pool = mysql.createPool(dbConfig);

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request:", req.body);
  // Use a connection from the pool to query the database
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    // Query the database to find a user with the provided username and password
    const query = "SELECT * FROM user WHERE email = ? AND password = ?";
    connection.query(query, [email, password], (queryErr, results) => {
      // Release the connection back to the pool
      connection.release();

      if (queryErr) {
        console.error("Error executing database query:", queryErr);
        res.status(500).json({ message: "Internal server error" });
        return;
      }

      // Check if the user exists
      if (results.length > 0) {
        res.status(200).json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    });
  });
});

app.post("/upload", upload.single("pdfFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    const pdfBuffer = req.file.buffer;
    const mimeType = req.body.mimeType || req.file.mimetype;

    const request = {
      name: "projects/scribehelper/locations/us/processors/78725b96bc710fbe",
      rawDocument: {
        content: pdfBuffer.toString("base64"),
        mimeType: mimeType,
      },
    };

    const [result] = await client.processDocument(request);
    console.log(result.document.text);
    console.log("------------------");
    const textContent = result.document.text;

    res.json({ textContent });
  } catch (error) {
    console.error("Error processing document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// const connection = mysql.createConnection({
//   host: "database-1.cy10b3zy7cdy.us-east-1.rds.amazonaws.com",
//   port: "3306",
//   user: "admin",
//   password: "password",
//   database: "my_db",
// });

// Function to get user information by email
function getUserInfoByEmail(email, callback) {
  // Assuming you have already created a connection pool named 'pool'
  const query =
    "SELECT id, email, firstname, lastname, role FROM user WHERE email = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      callback(err, null);
      return;
    }

    connection.query(query, [email], (err, results) => {
      connection.release(); // Release the connection after the query

      if (err) {
        console.error(err);
        callback(err, null);
      } else {
        callback(null, results[0]); // Assuming email is unique, so we return the first result
      }
    });
  });
}

// Endpoint to handle the "get_user_info" request
app.post("/get_user_info", (req, res) => {
  const { email } = req.body;

  // Call the getUserInfoByEmail function
  getUserInfoByEmail(email, (err, userInfo) => {
    if (err) {
      // Handle database error
      console.error("Error retrieving user info:", err);
      res.status(500).json({ message: "Internal server error" });
    } else {
      // Send the specific user info fields back to the client

      res.status(200).json(userInfo);
    }
  });
});

// Assuming you have your express app and MySQL connection set up

// Your checkNewUser function
function checkNewUser(email, callback) {
  // Assuming you have already created a connection pool named 'pool'
  const sql = "SELECT * FROM user WHERE email = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      callback(err, null, false); // Error occurred, not unique
      return;
    }

    connection.query(sql, [email], (err, results) => {
      connection.release(); // Release the connection after the query

      if (err) {
        console.error(err);
        callback(err, null, false); // Error occurred, not unique
      } else {
        if (results.length === 1) {
          // Email is unique, return user info
          callback(null, null, false);
        } else if (results.length === 0) {
          // Email not found, not unique
          callback(null, results[0], true);
        } else {
          // More than one result, email is not unique
          callback(null, null, false);
        }
      }
    });
  });
}

function createNewUser(newUser, callback) {
  const { firstname, lastname, email, password, role } = newUser;
  const sql =
    "INSERT INTO user (firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?)";

  // Assuming you have already created a connection pool named 'pool'
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      callback(err, null);
      return;
    }

    connection.query(
      sql,
      [firstname, lastname, email, password, role],
      (err, results) => {
        connection.release(); // Release the connection back to the pool

        if (err) {
          console.error("Error creating user:", err);
          callback(err, null); // Pass the error to the callback
        } else {
          // Assuming your table has an auto-incrementing primary key
          const userId = results.insertId;

          callback(null, userId); // Pass the user ID to the callback
        }
      },
    );
  });
}

// Express route to handle new user creation
app.post("/new_user", (req, res) => {
  const data = req.body;
  const email = data.email;

  // Check if the email is already in the database
  checkNewUser(email, (err, userInfo, isUnique) => {
    if (err) {
      // Handle the error
      console.error("Error:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (isUnique) {
        // Email is unique, proceed to create the new user
        createNewUser(data, (createErr, userId) => {
          if (createErr) {
            // Handle the error during user creation
            console.error("Error creating user:", createErr);
            res.status(500).json({ error: "Error creating user" });
          } else {
            // User created successfully
            res.json({
              success: true,
              message: "User created successfully",

              userId: userId,
            });
          }
        });
      } else {
        // Email is not unique or not found
        res.json({
          success: false,
          message: "Email is not unique.",
        });
      }
    }
  });
});

function createNewPatient(newPatient, callback) {
  const { userid, firstname, lastname, DOB, sex, createdat, updatedat } =
    newPatient;
  const sql =
    "INSERT INTO patient (userid, firstname, lastname, DOB, sex, createdat, updatedat) VALUES (?, ?, ?, ?, ?, ?, ?)";

  // Assuming you have already created a connection pool named 'pool'
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      callback(err, null);
      return;
    }

    connection.query(
      sql,
      [userid, firstname, lastname, DOB, sex, createdat, updatedat],
      (err, results) => {
        connection.release(); // Release the connection back to the pool

        if (err) {
          console.error("Error creating patient:", err, "Query:", sql);
          callback(err, null); // Pass the error to the callback
        } else {
          // Assuming your table has an auto-incrementing primary key
          const patientId = results.insertId;
          callback(null, patientId); // Pass the patient ID to the callback
        }
      },
    );
  });
}

app.post("/new_patient", (req, res) => {
  patient_data = req.body;

  createNewPatient(patient_data, (err, patientId) => {
    if (err) {
      // Handle the error
      console.error("Error creating patient:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      // Patient created successfully, send a success response
      patient_data.id = patientId;

      // Send the updated patient_data in the response
      res.status(201).json({ patient_data });
    }
  });
});

app.post("/fetch_patients_of_user", (req, res) => {
  const userId = req.body.userId; // Assuming userId is sent in the request body

  if (!userId) {
    return res
      .status(400)
      .json({ error: "Missing userId in the request body" });
  }

  const query =
    "SELECT id, firstname, lastname, DOB, sex FROM patient WHERE userid = ?";

  // Assuming you have already created a connection pool named 'pool'
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Execute the query with the userId parameter
    connection.query(query, [userId], (error, results) => {
      connection.release(); // Release the connection back to the pool

      if (error) {
        console.error("Error executing query: " + error.stack);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Send the results as JSON
      res.json(results);
    });
  });
});

app.post("/add_record", (req, res) => {
  const { data, userid, patientid, createdat, updatedat } = req.body;

  // Correct the number of placeholders in the SQL query
  const query =
    "INSERT into record (data, userid, patientid, createdat, updatedat) VALUES (?, ?, ?, ?, ?)";

  // Assuming you have already created a connection pool named 'pool'
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    connection.query(
      query,
      [data, userid, patientid, createdat, updatedat],
      (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
          console.error("Error executing query:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Assuming you want to send a response indicating success
        res.json({
          message: "Record added successfully",
          insertedId: results.insertId,
        });
      },
    );
  });
});

app.post("/fetch_record", (req, res) => {
  const { userid, patientid } = req.body;

  const query = "SELECT * FROM record WHERE userid = ? AND patientid = ?";

  // Assuming you have already created a connection pool named 'pool'
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    connection.query(query, [userid, patientid], (error, results) => {
      connection.release(); // Release the connection back to the pool

      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Successful fetch of record
      res.json({ records: results });
    });
  });
});

app.post("/fetch_data_record", (req, res) => {
  const { record_id } = req.body;

  const query = "SELECT data FROM record WHERE id = ?"; // Corrected SQL query

  // Assuming you have already created a connection pool named 'pool'
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    connection.query(query, [record_id], (error, results) => {
      connection.release(); // Release the connection back to the pool

      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      console.log("Successful fetch of record data");
      res.json({ records: results });
    });
  });
});

app.post("/delete_record", (req, res) => {
  const { record_id } = req.body;

  // Check if record_id is provided
  if (!record_id) {
    return res.status(400).json({ error: "Record ID is required" });
  }

  const query = "DELETE FROM record WHERE id = ?";

  // Assuming you have already created a connection pool named 'pool'
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    connection.query(query, [record_id], (deleteErr, results) => {
      connection.release(); // Release the connection back to the pool

      if (deleteErr) {
        console.error("Error deleting record:", deleteErr.stack);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      console.log("Record deleted successfully");
      res.status(200).json({ message: "Record deleted successfully" });
    });
  });
});

// app.post("/logout", (req, res) => {
//   // Perform any server-side actions, e.g., execute queries

//   // Assuming `connection` is a variable representing your MySQL connection
//   if (connection) {
//     // Check if the connection is still active
//     if (connection.state !== "disconnected") {
//       connection.end((err) => {
//         if (err) {
//           console.error("Error ending database connection:", err);
//           return res.status(500).json({ error: "Internal Server Error" });
//         }
//         console.log("Connection ended");
//         // Respond with success
//         res.json({ message: "Connection ended" });
//       });
//     } else {
//       console.log("Connection was already disconnected");
//       res.json({ message: "Connection already disconnected" });
//     }
//   } else {
//     // Handle the case where the connection is not available
//     console.error("Connection not available");
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// function get_patient_record_datas(patientid, callback) {
//   // SQL query
//   const query = 'SELECT data FROM record WHERE patientid = ?';

//   // Use the connection pool to execute the query
//   connection.query(query, [patientid], (error, results) => {
//     if (error) {
//       // Handle the error
//       console.error('Error executing query:', error);
//       callback(error, null);
//     } else {
//       // Send the results back through the callback
//       callback(null, results);
//     }
//   });
// }

// app.post("/summarize_records", (req,res)=> {
//   const {patient_id} = req.body;
//   console.log(patient_id)
//   get_patient_record_datas(patient_id, (error, results) => {
//     if (error) {
//       console.error('Error fetching patient record data:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       // You can process the results or send them directly as needed
//       res.json({ patientRecordData: results });
//     }
//   });
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err.stack);
//     return;
//   }

//   console.log('Connected to MySQL as id ' + connection.threadId);

//   // Do your database operations here...

//   // Close the MySQL connection immediately
//   connection.end((endErr) => {
//     if (endErr) {
//       console.error('Error closing MySQL connection:', endErr.stack);
//       return;
//     }

//     console.log('MySQL connection closed immediately');
//   });
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// function getAllTables(callback) {
//   connection.connect((err) => {
//     if (err) {
//       console.error("Error connecting to the database:", err);
//       return callback(err, null);
//     }

//     const query = "SHOW TABLES";

//     connection.query(query, (err, results) => {
//       if (err) {
//         console.error("Error executing query:", err);
//         connection.end(); // Close the connection in case of an error
//         return callback(err, null);
//       }

//       const tables = results.map((row) => Object.values(row)[0]);
//       connection.end(); // Close the connection after getting tables
//       callback(null, tables);
//     });
//   });
// }

// // Example usage
// getAllTables((err, tables) => {
//   if (err) {
//     console.error("Error getting tables:", err);
//   } else {
//     console.log("Tables:", tables);
//   }
// });

// function getAllUsers(callback) {
//   const query = "SELECT * FROM user";
//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error(err);
//       callback(err, null);
//     } else {
//       callback(null, results);
//     }
//   });
// }
// // Example usage
// getAllUsers((err, users) => {
//   if (err) {
//     console.error("Error fetching users:", err);
//   } else {
//     console.log("All users:", users);
//     // You can do something with the fetched users here
//   }
// });
// Example usage:
// createUser('Jeffrey', 'Chan', 'jeffreychan@example.com', 'password', 'Radiologist');
// createPatient(
//   "Ivan",
//   "Zhen",
//   0,
//   "2000-01-01",
//   "Male",
//   "2023-11-14 10:00:00",
//   "2023-11-14 10:00:00",
// );
// createRecord(
//   "His health record shows he is healthy",
//   0,
//   0,
//   "2023-11-14 10:00:00",
//   "2023-11-14 10:00:00",
// );

// const createTablesQuery = [
//   `
//   CREATE TABLE IF NOT EXISTS user (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     firstname TEXT,
//     lastname TEXT,
//     email VARCHAR(50) UNIQUE,
//     password VARCHAR(50),
//     role TEXT
//   )
//   `,
//   `
//   CREATE TABLE IF NOT EXISTS patient (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     firstname TEXT,
//     lastname TEXT,
//     userid INT,
//     DOB DATE,
//     sex TEXT,
//     createdat DATETIME,
//     updatedat DATETIME,
//     FOREIGN KEY (userid) REFERENCES user(id)
//   )
//   `,
//   `
//   CREATE TABLE IF NOT EXISTS record (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     data TEXT,
//     userid INT,
//     patientid INT,
//     createdat DATETIME,
//     updatedat DATETIME,
//     FOREIGN KEY (userid) REFERENCES user(id),
//     FOREIGN KEY (patientid) REFERENCES patient(id)
//   )
//   `,
// ];

// createTablesQuery.forEach((query) => {
//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log("Table created successfully");
//       connection.end();
//     }
//   });
// });

// Function to insert a user
// function createUser(firstname, lastname, email, password, role) {
//   const query = `
//     INSERT INTO user (firstname, lastname, email, password, role)
//     VALUES (?, ?, ?, ?, ?)
//   `;

//   const values = [firstname, lastname, email, password, role];

//   connection.query(query, values, (err, results) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log("User created successfully");
//     }
//   });
// }

// Function to insert a patient
// function createPatient(
//   firstname,
//   lastname,
//   userid,
//   DOB,
//   sex,
//   createdat,
//   updatedat,
// ) {
//   const query = `
//     INSERT INTO patient (firstname, lastname, userid, DOB, sex, createdat, updatedat)
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//   `;

//   const values = [firstname, lastname, userid, DOB, sex, createdat, updatedat];

//   connection.query(query, values, (err, results) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log("Patient created successfully");
//     }
//   });
// }

// // Function to insert a record
// function createRecord(data, userid, patientid, createdat, updatedat) {
//   const query = `
//     INSERT INTO record (data, userid, patientid, createdat, updatedat)
//     VALUES (?, ?, ?, ?, ?)
//   `;

//   const values = [data, userid, patientid, createdat, updatedat];

//   connection.query(query, values, (err, results) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log("Record created successfully");
//     }
//   });
// }

// Function to query a specific user by email
// function getUserByEmail(email, password, callback) {
//   const query = "SELECT * FROM user WHERE email = ? and password = ?";
//   connection.query(query, [email, password], (err, results) => {
//     if (err) {
//       console.error(err);
//       callback(err, null);
//     } else {
//       callback(null, results[0]); // Assuming email is unique, so we return the first result
//     }
//   });
// }
