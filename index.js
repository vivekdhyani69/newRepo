// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv'); 
// Set path to .env file 
dotenv.config({ path: './.env' }); 
const userRoutes = require('./routes/userRoutes');
const leadRoutes = require('./routes/leadRoutes');
const app = express();
app.use(express.json());

app.use(cors(
{
  origin : ["https://etlhive-assignment.vercel.app/"],
  methods : ["POST", "PUT", "DELETE","GET","PATCH"],
  credentials : true
}

));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));;



app.use('/api/users', userRoutes);

app.use('/api/leads', leadRoutes);

app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`)
);
