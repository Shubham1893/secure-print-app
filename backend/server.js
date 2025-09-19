require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/print', require('./routes/print'));
app.use('/s', require('./routes/linkRoutes')); // <-- ADDED: Handles short links

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));