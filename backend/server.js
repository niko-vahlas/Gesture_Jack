const connectDatabase = require('./config/database.js');
const express = require('express');
const corsOptions = {
  origin: 'https://niko-vahlas.github.io',
  optionsSuccessStatus: 200,
};

const userRoutes = require('./routes/userRoutes.js');

// Connect to Database
connectDatabase();

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Gesture Jack Backend');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
