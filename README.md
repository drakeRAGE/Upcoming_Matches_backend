# 🏀 Upcoming Basketball Matches

This project displays upcoming basketball matches using the [API-Basketball](https://rapidapi.com/api-sports/api/api-basketball) from RapidAPI.

📝 Assignment for **SportsOrca**

## 🔧 Tech Stack
- Frontend: JavaScript (React/Vite) + TailwindCSS
- Backend: Node.js/Express.js + Axios
- API: API-Basketball via RapidAPI : https://v1.basketball.api-sports.io

## 🚀 How to Run

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### 🌐 API Setup
Using Axios with RapidAPI:
```bash
const basketballApi = axios.create({
  baseURL: 'https://v1.basketball.api-sports.io',
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': 'v1.basketball.api-sports.io'
  }
});
```
