import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const basketballApi = axios.create({
  baseURL: 'https://v1.basketball.api-sports.io/games?date=2025-05-29',
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': 'v1.basketball.api-sports.io'
  }
});

app.get('/api/matches', async (req, res) => {
  try {
    const response = await basketballApi.get('/games', {
      params: {
        date: new Date().toISOString().split('T')[0],
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
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});