import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import mysql from "mysql"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import { jwtDecode } from "jwt-decode"
import nodemailer from "nodemailer"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, "uploads")


if (!fs.existsSync(uploadsDir)) {
  console.log("Creating uploads directory...")
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const app = express()
const port = 5001

app.use(cors())
app.use(bodyParser.json())

dotenv.config()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const safeFilename = uniqueSuffix + "-" + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_")
    cb(null, safeFilename)
  },
})



const upload = multer({ storage })
export default upload

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "adoptions",
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: true
  } : undefined
})

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack)
    return
  }
  console.log("Connected to MySQL database")
})

const photoFields = [
  { name: 'front_house', maxCount: 1 },
  { name: 'street_photo', maxCount: 1 },
  { name: 'living_room', maxCount: 1 },
  { name: 'dining_area', maxCount: 1 },
  { name: 'kitchen', maxCount: 1 },
  { name: 'bedroom', maxCount: 1 },
  { name: 'windows', maxCount: 1 },
  { name: 'front_backyard', maxCount: 1 },
  { name: 'valid_id', maxCount: 1 },
]

app.post("/submit-form", upload.fields(photoFields), (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    // Parse JSON fields if sent as text
    let formData = req.body;
    // If sent as JSON, parse it
    if (typeof formData === 'string') {
      formData = JSON.parse(formData);
    }

    const {
      FirstName,
      LastName,
      Address,
      Phone,
      Email,
      Occupation,
      CompanyName,
      SocProfile,
      Status,
      SelectedPet,
      ReasonToAdopt,
      ExperienceWithPets,
    } = formData;

    const sql = `
      INSERT INTO adoption_application (
        user_id, pet_id, first_name, last_name, address, phone, email, occupation, company_name,
        soc_profile, civil_status, selected_pet, reason_to_adopt, experience_with_pets, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    db.query(
      sql,
      [
        userId,
        SelectedPet,
        FirstName,
        LastName,
        Address,
        Phone,
        Email,
        Occupation,
        CompanyName,
        SocProfile,
        Status,
        SelectedPet,
        ReasonToAdopt,
        ExperienceWithPets,
      ],
      (err, results) => {
        if (err) {
          console.error("Error inserting data:", err);
          res.status(500).json({ message: "Database error" });
        } else {
          const applicationId = results.insertId;
          // Insert initial status into history
          const historySql = `
            INSERT INTO application_status_history (application_id, status, notes)
            VALUES (?, 'pending', 'Application submitted')
          `;
          db.query(historySql, [applicationId], (historyErr) => {
            if (historyErr) {
              console.error("Error creating status history:", historyErr);
            }
            // Save uploaded photos
            if (req.files) {
              const photoInserts = [];
              Object.entries(req.files).forEach(([field, files]) => {
                files.forEach(file => {
                  photoInserts.push([
                    applicationId,
                    field,
                    `/uploads/${file.filename}`
                  ]);
                });
              });
              if (photoInserts.length > 0) {
                const photoSql = `INSERT INTO adoption_application_photos (application_id, photo_type, file_path) VALUES ?`;
                db.query(photoSql, [photoInserts], (photoErr) => {
                  if (photoErr) {
                    console.error("Error saving application photos:", photoErr);
                  }
                  res.status(200).json({ 
                    message: "Application submitted successfully",
                    applicationId
                  });
                });
                return;
              }
            }
            res.status(200).json({ 
              message: "Application submitted successfully",
              applicationId
            });
          });
        }
      }
    );
  } catch (error) {
    console.error("Error processing token:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

app.use("/uploads", (req, res, next) => {
  console.log(`Image requested: ${req.path}`)
  next()
})

app.use(
  "/uploads",
  express.static(uploadsDir, {
    maxAge: "1d",
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      res.setHeader("Cache-Control", "public, max-age=86400")
    },
  }),
)

// Add a route to check if an image exists
app.get("/check-image/:filename", (req, res) => {
  const filename = req.params.filename
  const filePath = path.join(uploadsDir, filename)

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`Image not found: ${filename}`)
      res.status(404).json({ exists: false, error: "File not found" })
    } else {
      console.log(`Image found: ${filename}`)
      res.json({ exists: true, path: `/uploads/${filename}` })
    }
  })
})

app.get("/pets", (req, res) => {
  const sql = `
    SELECT p.*, pc.* 
    FROM pets p 
    LEFT JOIN pet_characteristics pc ON p.pet_id = pc.pet_id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching pets:", err);
      res.status(500).json({ message: "Error fetching pets" });
    } else {
      // Check and normalize image paths
      results.forEach((pet) => {
        if (pet.img) {
          const filename = pet.img.replace(/^\/?(uploads\/)?/, "");

          const imagePath = path.join(uploadsDir, filename);
          const exists = fs.existsSync(imagePath);
          if (!exists) {
            pet.img = "/uploads/default.jpg";
          } else {
            pet.img = `/uploads/${filename}`; // Ensure the path is correct for the frontend
          }
        } else {
          pet.img = "/uploads/default.jpg";
        }
      });

      res.json(results);
    }
  });
});

app.get("/api/users", (req, res) => {
  const sql = "SELECT * FROM users"
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err)
      res.status(500).json({ message: "Database error" })
    } else {
      res.json(results)
    }
  })
})

// Add new endpoint to get user by ID
app.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  
  const sql = "SELECT id, username, email, created_at FROM users WHERE id = ?";
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ message: "Database error" });
    } else if (results.length === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      // Format the created_at date
      const user = {
        ...results[0],
        created_at: new Date(results[0].created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
      res.json(user);
    }
  });
});

// Add favorite
app.post("/favorites/:petId", (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwtDecode(token);
    const userId = decoded.id;
    const petId = req.params.petId;

    const sql = "INSERT INTO favorites (user_id, pet_id) VALUES (?, ?)";
    db.query(sql, [userId, petId], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: "Pet already favorited" });
        }
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "Pet favorited successfully" });
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Remove favorite
app.delete("/favorites/:petId", (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwtDecode(token);
    const userId = decoded.id;
    const petId = req.params.petId;

    const sql = "DELETE FROM favorites WHERE user_id = ? AND pet_id = ?";
    db.query(sql, [userId, petId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Favorite removed successfully" });
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Check if pet is favorited
app.get("/favorites/check/:petId", (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwtDecode(token);
    const userId = decoded.id;
    const petId = req.params.petId;

    const sql = "SELECT * FROM favorites WHERE user_id = ? AND pet_id = ?";
    db.query(sql, [userId, petId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ isFavorited: results.length > 0 });
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Get user's favorite pets
app.get("/favorites/user/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT p.* 
    FROM pets p 
    JOIN favorites f ON p.pet_id = f.pet_id 
    WHERE f.user_id = ? 
    ORDER BY f.created_at DESC
  `;
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching favorite pets:", err);
      res.status(500).json({ message: "Database error" });
    } else {
      // Process image paths similar to the /pets endpoint
      results.forEach((pet) => {
        if (pet.img) {
          const filename = pet.img.replace(/^\/?(uploads\/)?/, "");
          const imagePath = path.join(uploadsDir, filename);
          if (!fs.existsSync(imagePath)) {
            pet.img = "/uploads/default.jpg";
          } else {
            pet.img = `/uploads/${filename}`;
          }
        } else {
          pet.img = "/uploads/default.jpg";
        }
      });
      res.json(results);
    }
  });
});

// Endpoint for user to submit a remark (user remark)
app.post("/adoption-status/:applicationId/user-remark", (req, res) => {
  const { applicationId } = req.params;
  const { remark } = req.body;
  // Insert a new status history entry with the latest status and user remark
  const getStatusSql = `SELECT status FROM adoption_application WHERE application_id = ?`;
  db.query(getStatusSql, [applicationId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: "Application not found" });
    }
    const status = results[0].status;
    const insertSql = `INSERT INTO application_status_history (application_id, status, user_remark) VALUES (?, ?, ?)`;
    db.query(insertSql, [applicationId, status, remark], (insertErr) => {
      if (insertErr) {
        return res.status(500).json({ message: "Failed to save user remark" });
      }
      res.json({ message: "User remark submitted" });
    });
  });
});

// Update: Get user's adoption status (with notes and status history, including user/admin remarks)
app.get("/adoption-status/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT 
      aa.application_id,
      aa.status,
      aa.created_at,
      aa.notes,
      p.name as pet_name,
      p.type as pet_type,
      aa.first_name, aa.last_name, aa.address, aa.phone, aa.email, aa.occupation, aa.company_name, aa.soc_profile, aa.civil_status, aa.reason_to_adopt, aa.experience_with_pets
    FROM adoption_application aa
    JOIN pets p ON aa.pet_id = p.pet_id
    WHERE aa.user_id = ?
    ORDER BY aa.created_at DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching adoption status:", err);
      res.status(500).json({ message: "Database error" });
    } else {
      // For each application, fetch status history and photos
      const appIds = results.map(app => app.application_id);
      if (appIds.length === 0) return res.json([]);
      const histSql = `SELECT * FROM application_status_history WHERE application_id IN (?) ORDER BY changed_at ASC`;
      const photoSql = `SELECT * FROM adoption_application_photos WHERE application_id IN (?)`;
      db.query(histSql, [appIds], (histErr, histResults) => {
        db.query(photoSql, [appIds], (photoErr, photoResults) => {
          // Attach history and photos to each application
          const appMap = {};
          results.forEach(app => { appMap[app.application_id] = app; app.status_history = []; app.photos = []; });
          if (!histErr && histResults) {
            histResults.forEach(hist => {
              if (appMap[hist.application_id]) {
                appMap[hist.application_id].status_history.push(hist);
              }
            });
          }
          if (!photoErr && photoResults) {
            photoResults.forEach(photo => {
              if (appMap[photo.application_id]) {
                appMap[photo.application_id].photos.push(photo);
              }
            });
          }
          res.json(results);
        });
      });
    }
  });
});

// Nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'nillarbernardlee@gmail.com',
    pass: process.env.EMAIL_PASS || 'vxqc ktie edoa lmjc'
  },
})

// Update application status
app.put("/adoption-status/:applicationId", (req, res) => {
  const { applicationId } = req.params;
  const { status, notes } = req.body;

  const sql = `
    UPDATE adoption_application 
    SET status = ?, 
        updated_at = CURRENT_TIMESTAMP
    WHERE application_id = ?
  `;

  db.query(sql, [status, applicationId], (err, result) => {
    if (err) {
      console.error("Error updating application status:", err);
      res.status(500).json({ message: "Database error" });
    } else {
      // After updating status, send email notification
      const getAppSql = 'SELECT email, first_name, pet_id FROM adoption_application WHERE application_id = ?';
      db.query(getAppSql, [applicationId], (err, results) => {
        if (!err && results.length > 0) {
          const { email, first_name, pet_id } = results[0];
          // Fetch pet name
          const getPetSql = 'SELECT name FROM pets WHERE pet_id = ?';
          db.query(getPetSql, [pet_id], (petErr, petResults) => {
            const petName = petResults && petResults.length > 0 ? petResults[0].name : 'your pet';
            // Compose email
            const mailOptions = {
              from: process.env.GMAIL_USER,
              to: email,
              subject: `Your Adoption Application Status: ${status}`,
              text: `Hi ${first_name},\n\nYour application for ${petName} is now \"${status}\".\n\nThank you for using PawConnect!`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error('Error sending email:', error);
              } else {
                console.log('Email sent:', info.response);
              }
            });
          });
        }
      });
      res.json({ message: "Status updated successfully" });
    }
  });
});

// When fetching applications, join photos
app.get("/admin/applications", (req, res) => {
  const sql = `
    SELECT 
      aa.application_id,
      aa.status,
      aa.created_at,
      aa.notes,
      u.username,
      u.email,
      p.name as pet_name,
      p.type as pet_type,
      aa.first_name, aa.last_name, aa.address, aa.phone, aa.occupation, aa.company_name, aa.soc_profile, aa.civil_status, aa.reason_to_adopt, aa.experience_with_pets
    FROM adoption_application aa
    JOIN users u ON aa.user_id = u.id
    JOIN pets p ON aa.pet_id = p.pet_id
    ORDER BY aa.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching admin applications:", err);
      res.status(500).json({ message: "Database error" });
    } else {
      // Fetch photos for all applications
      const appIds = results.map(app => app.application_id);
      if (appIds.length === 0) return res.json([]);
      const photoSql = `SELECT * FROM adoption_application_photos WHERE application_id IN (?)`;
      db.query(photoSql, [appIds], (photoErr, photoResults) => {
        if (photoErr) {
          console.error("Error fetching application photos:", photoErr);
          res.json(results);
        } else {
          // Attach photos to each application
          const appMap = {};
          results.forEach(app => { appMap[app.application_id] = app; app.photos = []; });
          photoResults.forEach(photo => {
            if (appMap[photo.application_id]) {
              appMap[photo.application_id].photos.push(photo);
            }
          });
          res.json(results);
        }
      });
    }
  });
});

// cancel application form
app.post("/adoption-status/:applicationId/cancel", (req, res) => {
  const { applicationId } = req.params;
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const verifySql = `SELECT user_id FROM adoption_application WHERE application_id = ?`;
    db.query(verifySql, [applicationId], (verifyErr, verifyResults) => {
      if (verifyErr || verifyResults.length === 0) {
        return res.status(404).json({ message: "Application not found" });
      }

      if (verifyResults[0].user_id !== userId) {
        return res.status(403).json({ message: "Not authorized to cancel this application" });
      }

      const updateSql = `
        UPDATE adoption_application 
        SET status = 'canceled', 
            updated_at = CURRENT_TIMESTAMP
        WHERE application_id = ?
      `;

      db.query(updateSql, [applicationId], (updateErr) => {
        if (updateErr) {
          console.error("Error canceling application:", updateErr);
          return res.status(500).json({ message: "Database error" });
        }

        const historySql = `
          INSERT INTO application_status_history (application_id, status, notes)
          VALUES (?, 'canceled', 'Application canceled by user')
        `;
        
        db.query(historySql, [applicationId], (historyErr) => {
          if (historyErr) {
            console.error("Error creating status history:", historyErr);
          }
          res.json({ message: "Application canceled successfully" });
        });
      });
    });
  } catch (error) {
    console.error("Error processing token:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

// Update the getStatusColor function to include canceled status
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'canceled':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'for compliance':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const editUpload = multer({ storage });

app.put('/adoption-status/:applicationId/edit', editUpload.fields([
  { name: 'front_house', maxCount: 1 },
  { name: 'street_photo', maxCount: 1 },
  { name: 'living_room', maxCount: 1 },
  { name: 'dining_area', maxCount: 1 },
  { name: 'kitchen', maxCount: 1 },
  { name: 'bedroom', maxCount: 1 },
  { name: 'windows', maxCount: 1 },
  { name: 'front_backyard', maxCount: 1 },
  { name: 'valid_id', maxCount: 1 },
]), (req, res) => {
  const { applicationId } = req.params;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  let userId;
  try {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  // Only allow update if user owns the application
  const verifySql = 'SELECT user_id FROM adoption_application WHERE application_id = ?';
  db.query(verifySql, [applicationId], (verifyErr, verifyResults) => {
    if (verifyErr || verifyResults.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (verifyResults[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to edit this application' });
    }
    // Update fields
    const {
      first_name, last_name, address, phone, email, occupation, company_name, soc_profile, civil_status, reason_to_adopt, experience_with_pets, user_remark
    } = req.body;
    const updateSql = `
      UPDATE adoption_application SET
        first_name = ?,
        last_name = ?,
        address = ?,
        phone = ?,
        email = ?,
        occupation = ?,
        company_name = ?,
        soc_profile = ?,
        civil_status = ?,
        reason_to_adopt = ?,
        experience_with_pets = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE application_id = ?
    `;
    db.query(updateSql, [
      first_name, last_name, address, phone, email, occupation, company_name, soc_profile, civil_status, reason_to_adopt, experience_with_pets, applicationId
    ], (updateErr) => {
      if (updateErr) {
        console.error('Error updating application:', updateErr);
        return res.status(500).json({ message: 'Database error' });
      }
      // Handle photo uploads
      const photoFields = [
        'front_house', 'street_photo', 'living_room', 'dining_area', 'kitchen', 'bedroom', 'windows', 'front_backyard', 'valid_id'
      ];
      const files = req.files || {};
      const updatePhoto = (field, cb) => {
        if (!files[field] || files[field].length === 0) return cb();
        const file = files[field][0];
        // Check if a photo already exists for this type
        const selectSql = 'SELECT id, file_path FROM adoption_application_photos WHERE application_id = ? AND photo_type = ?';
        db.query(selectSql, [applicationId, field], (selErr, selResults) => {
          if (selErr) return cb(selErr);
          const filePath = `/uploads/${file.filename}`;
          if (selResults.length > 0) {
            // Optionally, delete old file from disk
            const oldPath = selResults[0].file_path;
            if (oldPath && oldPath !== filePath) {
              const absPath = path.join(uploadsDir, oldPath.replace(/^\/uploads\//, ''));
              fs.unlink(absPath, () => {}); // ignore errors
            }
            // Update existing photo
            const updatePhotoSql = 'UPDATE adoption_application_photos SET file_path = ? WHERE id = ?';
            db.query(updatePhotoSql, [filePath, selResults[0].id], cb);
          } else {
            // Insert new photo
            const insertPhotoSql = 'INSERT INTO adoption_application_photos (application_id, photo_type, file_path) VALUES (?, ?, ?)';
            db.query(insertPhotoSql, [applicationId, field, filePath], cb);
          }
        });
      };
      // Update all provided photos
      let i = 0;
      function nextPhoto(err) {
        if (err) {
          console.error('Error updating photo:', err);
          return res.status(500).json({ message: 'Error updating photo' });
        }
        if (i >= photoFields.length) {
          // After updating fields and photos, set status to 'evaluate' and add a status history entry
          const setEvaluateSql = `UPDATE adoption_application SET status = 'evaluate' WHERE application_id = ?`;
          db.query(setEvaluateSql, [applicationId], (evalErr) => {
            if (evalErr) {
              console.error('Error updating status to evaluate:', evalErr);
              return res.status(500).json({ message: 'Error updating status' });
            }
            const historySql = `INSERT INTO application_status_history (application_id, status, notes) VALUES (?, 'evaluate', 'User submitted compliance edits')`;
            db.query(historySql, [applicationId], (historyErr) => {
              if (historyErr) {
                console.error('Error inserting status history:', historyErr);
              }
              // Save user remark as a timeline entry if present
              if (user_remark && user_remark.trim() !== "") {
                const getStatusSql = `SELECT status FROM adoption_application WHERE application_id = ?`;
                db.query(getStatusSql, [applicationId], (err, results) => {
                  if (!err && results.length > 0) {
                    const status = results[0].status;
                    const insertSql = `INSERT INTO application_status_history (application_id, status, user_remark) VALUES (?, ?, ?)`;
                    db.query(insertSql, [applicationId, status, user_remark], (insertErr) => {
                      // Log or ignore insertErr
                      res.json({ message: 'Application updated successfully' });
                    });
                  } else {
                    res.json({ message: 'Application updated successfully' });
                  }
                });
              } else {
                res.json({ message: 'Application updated successfully' });
              }
            });
          });
          return;
        }
        updatePhoto(photoFields[i++], nextPhoto);
      }
      nextPhoto();
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

