const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const basketballApi = axios.create({
  baseURL: 'https://v1.basketball.api-sports.io',
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': 'v1.basketball.api-sports.io'
  }
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Incoming ${req.method} request to ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Query params:', req.query);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Middleware Error:', err);
  next(err);
});

// Add enhanced error handling wrapper
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Modify your matches endpoint to use the handler
app.get('/api/matches', asyncHandler(async (req, res) => {
  try {
    // Get the date from query parameters, default to today if not provided
    const date = req.query.date || new Date().toISOString().split('T')[0];
    console.log(`Fetching matches for date: ${date}`);

    const response = await basketballApi.get('/games', {
      params: {
        date: date,
      }
    });

    const matches = response.data.response.map(game => ({
      date: game.date,
      time: game.time,
      teams: {
        home: {
          id: game.teams.home.id,
          name: game.teams.home.name,
          logo: game.teams.home.logo
        },
        away: {
          id: game.teams.away.id,
          name: game.teams.away.name,
          logo: game.teams.away.logo
        }
      },
      league: {
        name: game.league.name,
        logo: game.league.logo
      },
      country: {
        name: game.country.name,
        code: game.country.code,
        flag: game.country.flag
      },
      status: {
        long: game.status.long,
        short: game.status.short
      }
    }));

    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ 
      message: 'Error fetching matches',
      error: error.response?.data || error.message 
    });
  }
}));

app.get('/', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running in development on port ${PORT}`);
  });
}

module.exports = app;