import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { extname } from 'path';
import { readFileSync } from 'fs';
import admin from 'firebase-admin';
import session from 'express-session';
import bodyParser from 'body-parser'; 
import { verifyToken } from './verifyToken.js';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(readFileSync(process.env.FIREBASE_CREDENTIALS, 'utf8'));
const { json, urlencoded } = bodyParser;


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
const auth = admin.auth();
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
// Initialize Express App
const app = express();

// Multer Configuration (Memory Storage)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    httpOnly: true, 
    cookie: { maxAge: 5 * 60 * 1000 }, // 5 minutes
  })
);

const sessionHandler = (req, res, next) => {
  if (req.session.user) {
    req.session._garbage = Date();
    req.session.touch();
  }
  next();
};

// Routes
app.post('/login', (req, res) => {
  const token = "your-auth-token";
  res.cookie("authToken", token, {
    httpOnly: true, // Prevent client-side JavaScript from accessing the token
    secure: false, // Set true in production (for HTTPS)
    sameSite: "lax", // Helps with CSRF protection
  });
  res.send("Token set");
});

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

// Get the auth token
const token = getCookie('authToken');
console.log(token);
app.get('/protected', sessionHandler, (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
  res.status(200).json({ message: 'Welcome to the protected route.' });
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
});


app.get('/session-test', (req, res) => {
  req.session.user = { name: 'John Doe' };
  res.send('Session created!');
});

app.get('/get-session', (req, res) => {
  res.json(req.session.user || 'No session found');
});


// Add Employee
app.post('/employees/add', upload.single('photo'), async (req, res) => {
  try {
    const { name, surname, age, idNumber, role, email, position, department, phone, startDate } = req.body;

    if (!req.file) return res.status(400).json({ error: 'No photo uploaded.' });

    const blob = bucket.file(Date.now() + extname(req.file.originalname));
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: { contentType: req.file.mimetype },
    });

    blobStream.on('error', err => {
      console.error('Error uploading file:', err);
      return res.status(500).json({ error: 'Failed to upload photo.' });
    });

    blobStream.on('finish', async () => {
      const photoUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      await db.collection('employees').add({
        name, surname, age, idNumber, role, email, position, department, phone, startDate, photo: photoUrl,
      });

      res.status(201).json({ message: 'Employee added successfully' });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Failed to add employee.' });
  }
});

// Get Employees
app.get('/employees', async (req, res) => {
  try {
    const snapshot = await db.collection('employees').get();
    const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees.' });
  }
});

// Delete Employee
app.delete('/employees/delete/:id', async (req, res) => {
  try {
    const employeeRef = db.collection('employees').doc(req.params.id);
    const doc = await employeeRef.get();

    if (!doc.exists) return res.status(404).json({ error: 'Employee not found.' });

    await employeeRef.delete();
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee.' });
  }
});

// Update Employee
app.put('/employees/update/:id', upload.single('photo'), async (req, res) => {
  try {
    const employeeRef = db.collection('employees').doc(req.params.id);
    const doc = await employeeRef.get();

    if (!doc.exists) return res.status(404).json({ error: 'Employee not found.' });

    let photoUrl = doc.data().photo;

    if (req.file) {
      const blob = bucket.file(Date.now() + extname(req.file.originalname));
      await new Promise((resolve, reject) => {
        const blobStream = blob.createWriteStream({
          resumable: false,
          metadata: { contentType: req.file.mimetype },
        });

        blobStream.on('error', err => reject(err));
        blobStream.on('finish', () => {
          photoUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve();
        });

        blobStream.end(req.file.buffer);
      });
    }

    await employeeRef.update({ ...req.body, photo: photoUrl });
    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee.' });
  }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
