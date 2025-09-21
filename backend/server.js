// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const connectDB = require('./config/db');

// // Connect to Database
// connectDB();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Define Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/documents', require('./routes/documents'));
// app.use('/api/print', require('./routes/print'));
// app.use('/s', require('./routes/linkRoutes')); // <-- ADDED: Handles short links

// // Serve uploaded files statically
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// --- UPDATED CORS CONFIGURATION ---
// This robust configuration ensures your live frontend can communicate with your backend.
const corsOptions = {
  origin: 'https://secure-print-app-1-5.onrender.com', // Your live frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allows all necessary HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Allows important headers
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// --- END OF UPDATE ---

// Middleware
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/print', require('./routes/print'));
app.use('/s', require('./routes/linkRoutes'));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
