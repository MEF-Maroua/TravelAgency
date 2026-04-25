const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads folder exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Connexion à MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'TravelAgency'
});

db.connect((err) => {
  if(err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database TravelAgency');
  }
});

// ===================================
// Upload Endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ 
    message: "File uploaded successfully", 
    filePath: `/uploads/${req.file.filename}` 
  });
});

// ===================================
// Registration (Register)
app.post('/register', async (req, res) => {
    const { username, email, password, role, agency_name, wilaya, phone, logo } = req.body;
    
    const userRole = role || 'user';

    // Check if the email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) return res.status(500).json({ error: err });

        if (result.length > 0) {
            return res.status(400).json({ message: "Email already used" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into the database
        db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
            [username, email, hashedPassword, userRole],
            (err, userResult) => {
                if (err) return res.status(500).json({ error: err });
                const userId = userResult.insertId;

                if (userRole === 'agency') {
                  // Insert into agencies table
                  const agencyQuery = 'INSERT INTO agencies (user_id, agency_name, wilaya, phone, logo) VALUES (?, ?, ?, ?, ?)';
                  db.query(agencyQuery, [userId, agency_name, wilaya, phone, logo || null], (err, agencyResult) => {
                    if (err) {
                      console.error("Error creating agency:", err);
                      return res.status(500).json({ message: "Error creating agency profile", error: err });
                    }
                    res.status(200).json({ message: "Agency created successfully", userId, agencyId: agencyResult.insertId });
                  });
                } else {
                  res.status(200).json({ message: "User created successfully", userId });
                }
            }
        );
    });
});

// ===================================
// Login (Login)
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) return res.status(500).json({ error: err });

        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // If agency, get agency ID
        if (user.role === 'agency') {
          db.query('SELECT id, agency_name, wilaya, logo FROM agencies WHERE user_id = ?', [user.id], (err, agencyRes) => {
            if (err) return res.status(500).json({ error: err });
            
            const agencyInfo = agencyRes[0] || null;
            res.status(200).json({ message: "Login successful", user: { ...user, agencyInfo } });
          });
        } else {
          res.status(200).json({ message: "Login successful", user });
        }
    });
});

// ===================================
// Agency & Wilaya Endpoints
app.get('/agencies/wilaya/:wilaya', (req, res) => {
  const { wilaya } = req.params;
  db.query('SELECT * FROM agencies WHERE wilaya = ?', [wilaya], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching agencies' });
    res.status(200).json(results);
  });
});

// ===================================
// Tours Endpoints
app.get('/tours/agency/:agency_id', (req, res) => {
  const { agency_id } = req.params;
  db.query('SELECT * FROM tours WHERE agency_id = ?', [agency_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching tours' });
    res.status(200).json(results);
  });
});

app.post('/tours', (req, res) => {
  const { agency_id, title, city, wilaya, distance, photo, desc: description, price, featured, tour_date } = req.body;
  
  const final_distance = distance || 0;
  const final_featured = featured || 0;
  const final_photo = photo || '';
  const final_description = description || '';

  console.log("Adding tour with payload:", req.body);
  
  // Note: maxGroupSize removed as it is not in the current DB schema
  const sql = `INSERT INTO tours (agency_id, title, city, wilaya, distance, photo, \`desc\`, price, featured, tour_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(sql, [agency_id, title, city, wilaya, final_distance, final_photo, final_description, price, final_featured, tour_date], (err, result) => {
    if (err) {
      console.error('DATABASE ERROR:', err);
      return res.status(500).json({ message: `Database error: ${err.sqlMessage || err.message}` });
    }
    console.log("Tour added successfully with ID:", result.insertId);
    res.status(201).json({ message: 'Tour added successfully', tourId: result.insertId });
  });
});

app.put('/tours/:id', (req, res) => {
  const { id } = req.params;
  const { title, city, wilaya, distance, photo, desc, price, maxGroupSize, featured, tour_date } = req.body;
  const sql = `UPDATE tours SET title=?, city=?, wilaya=?, distance=?, photo=?, desc=?, price=?, maxGroupSize=?, featured=?, tour_date=? WHERE id=?`;
  
  db.query(sql, [title, city, wilaya, distance, photo, desc, price, maxGroupSize, featured, tour_date, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating tour', error: err });
    res.status(200).json({ message: 'Tour updated successfully' });
  });
});

app.delete('/tours/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tours WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting tour' });
    res.status(200).json({ message: 'Tour deleted successfully' });
  });
});

// Fetch all tours (for search or global view if needed)
app.get('/tours', (req, res) => {
  db.query('SELECT * FROM tours', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching all tours' });
    res.status(200).json(results);
  });
});

// Fetch single tour
app.get('/tours/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM tours WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching tour' });
    if (results.length === 0) return res.status(404).json({ message: 'Tour not found' });
    res.status(200).json(results[0]);
  });
});

// ===================================
// Booking (Booking)
app.post('/booking', (req, res) => {
    const {
        user_id, email, full_name, phone, guest_size, book_date, tour_id, total_price,
        card_number, expiry_date, cvv
    } = req.body;

    const sql = `
        INSERT INTO bookings 
        (user_id, email, full_name, phone, guest_size, book_date, tour_id, total_price, card_number, expiry_date, cvv, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
    `;

    db.query(sql, [
        user_id, email, full_name, phone, guest_size, book_date, tour_id, total_price,
        card_number, expiry_date, cvv
    ], (err, result) => {
        if (err) {
            console.error('Error during booking:', err);
            return res.status(500).json({ message: 'Error during booking.', error: err });
        }
        res.status(201).json({ message: 'Booking successful!', bookingId: result.insertId });
    });
});

// View bookings for an agency
app.get('/bookings/agency/:agency_id', (req, res) => {
  const { agency_id } = req.params;
  const sql = `
    SELECT b.*, t.title as tour_title 
    FROM bookings b 
    JOIN tours t ON b.tour_id = t.id 
    WHERE t.agency_id = ?
    ORDER BY b.created_at DESC
  `;
  db.query(sql, [agency_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching agency bookings', error: err });
    res.status(200).json(results);
  });
});

// View bookings for a user
app.get('/bookings/user/:user_id', (req, res) => {
  const { user_id } = req.params;
  const sql = `
    SELECT b.*, t.title as tour_title, t.photo as tour_photo
    FROM bookings b 
    JOIN tours t ON b.tour_id = t.id 
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC
  `;
  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user bookings', error: err });
    res.status(200).json(results);
  });
});

// Cancel a booking
app.put('/bookings/:id/cancel', (req, res) => {
  const { id } = req.params;
  db.query("UPDATE bookings SET status = 'cancelled' WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error cancelling booking' });
    res.status(200).json({ message: 'Booking cancelled successfully' });
  });
});

// ===================================
// Reviews
app.post('/addReview', (req, res) => {
    const { tour_id, user_name, reviewText, rating } = req.body;
    const sql = `INSERT INTO reviews (tour_id, user_name, reviewText, rating) VALUES (?, ?, ?, ?)`;

    db.query(sql, [tour_id, user_name, reviewText, rating], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error while adding the review.' });
        res.status(201).json({ message: 'Review added successfully!', reviewId: result.insertId });
    });
});

app.get('/getReviews/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM reviews WHERE tour_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching reviews.' });
        res.status(200).json(results);
    });
});

// ===================================
// Newsletter
app.post('/subscribe', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
  
    db.query('INSERT INTO newsletter (email, subscribed_at) VALUES (?, NOW())', [email], (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.status(200).json({ message: 'Subscription successful' });
    });
});

// ===================================
// Knowledge Base
app.get('/knowledge', (req, res) => {
  db.query('SELECT * FROM knowledge', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching knowledge base' });
    res.status(200).json(results);
  });
});

// ===================================
// Start the server
const port = 3001;
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
