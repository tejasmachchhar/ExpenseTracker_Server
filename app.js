require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// express object
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Setup cors to allow cross url communication

app.use(cors());

// const allowedOrigin = ""//"https://localhost"

// app.use(cors({
//     origin: allowedOrigin,
//     methods: ["GET", "POST", "DELETE"], //"PUT"
//     credentials: true, // Allowed cookies andd authentication headers
//     allowedHeaders: ["Content-Type", "Authorization"] // Allowed headers
// }));

// import role routes
const roleRoutes = require('./src/routes/RoleRoutes');
// use role routes
app.use(roleRoutes);

const userRoutes = require('./src/routes/UserRoutes');
app.use(userRoutes);

const tranCategoriesRoutes = require('./src/routes/TransactionCategoriesRoutes');
app.use(tranCategoriesRoutes);

const tranTypeRoutes = require('./src/routes/TranTypeRoutes');
app.use(tranTypeRoutes);

const expenseRoutes = require('./src/routes/ExpenseRoutes');
const authenticate = require('./src/middlewares/authenticate');
// Protect expense routes
app.use(authenticate, expenseRoutes);

const accountRoutes = require('./src/routes/AccountRoutes');
app.use(accountRoutes);

const errorHandler = require('./src/middlewares/errorHandler');
app.use(errorHandler);

// Database connection
mongoose.connect('mongodb://localhost:27017/ExpenseTrackerDB', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to the database');
}).catch((err) => {
    console.error('Database connection error:', err);
});

// server creation 
const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server started on port number ', PORT);
});
