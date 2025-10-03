const express = require('express');
const authRoutes = require('./routes/auth.route');
const dashRoutes = require('./routes/dasboard.route');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors')

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors())

app.use('/api/auth', authRoutes);
app.use('/api/dash', dashRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT , () => {
    console.log('Server is running on port 3000');
});
