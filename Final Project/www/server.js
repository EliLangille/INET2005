const express = require('express');
const MLBStatsAPI = require('mlb-stats-api');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const fs = require('fs');
const app = express();
const port = 3000;

const mlbStats = new MLBStatsAPI();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));

// MongoDB connection setup
const mongoURI = 'mongodb://mongo:27017/mlb-stats';
mongoose.connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
    loadTeamIDs();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Mongoose schema for caching team IDs
const teamSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true }
});

const Team = mongoose.model('Team', teamSchema);

async function loadTeamIDs() {
  const teamsCount = await Team.countDocuments();
  if (teamsCount > 0) return;

  console.log("Teams not in database, loading from file...");

  const teamIDs = JSON.parse(fs.readFileSync('./team_ids.json', 'utf-8')).teams;

  for (const team of teamIDs) {
    const teamDoc = new Team({
      id: team.id,
      name: team.name
    });

    try {
      await teamDoc.save();
      console.log(`Team ${team.name} saved to database.`);
    } catch (error) {
      console.error(`Error saving team ${team.name}:`, error);
    }
  }
}

// Routes

// Root Page (login if not signed in, else main page)
app.get('/', (req, res) => {
  console.log("Root hit");
  if (!req.session.user) {
    return res.redirect('/login');
  }
  console.log("Root, Session found: ", req.session.user);
  res.redirect('/index.html');
});

// Login Page
app.get('/login', (req, res) => {
  console.log("Login hit");
  res.sendFile('src/login.html', { root: '.' });
});

// Login Handler
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = { eli: 'password', jamie: 'password' };

  if (users[username] && users[username] === password) {
    req.session.user = username; 
    res.redirect('/index.html'); // Successful login, redirect to main page
  } else {
    // Send back to login with error=invalid in the query string
    res.redirect('/login?error=invalid');
  }
});

// Logout Handler
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Main Page
app.use('/index.html', (req, res, next) => {
  console.log("Index hit");
  if (!req.session.user) return res.redirect('/login');
  console.log("Index, Session found: ", req.session.user);
  next();
});

// List of Teams
app.get('/teams', async (req, res) => {
  try {
    console.log("Fetching teams from MongoDB...");
    const teams = await Team.find({}, { _id: 0, id: 1, name: 1 }).exec();
    res.json(teams); // Send teams as JSON
  } catch (error) {
    console.error("Error fetching teams:", error.message);
    // Respond with JSON even for errors
    res.status(500).json({ error: "Error fetching teams." });
  }
});

// Team Info and Roster Handler
app.get('/team-stats/:teamId', async (req, res) => {
  const teamId = req.params.teamId;
  
  try {
    // Fetch team stats and roster from MLB Stats API
    const teamStats = await mlbStats.getTeam({ pathParams: { teamId: teamId } });
    const teamStatsParsed = await teamStats.json();

    const teamRoster = await mlbStats.getTeamRoster({ pathParams: { teamId: teamId } });
    const teamRosterParsed = await teamRoster.json();

    // Extract basic team info
    const teamData = {
      name: teamStatsParsed.teams[0].name,
      venue: teamStatsParsed.teams[0].venue.name,
      abbreviation: teamStatsParsed.teams[0].abbreviation,
      division: teamStatsParsed.teams[0].division.name,
      firstYear: teamStatsParsed.teams[0].firstYearOfPlay
    };

    // Extract player details for each roster member
    const rosterData = teamRosterParsed.roster.map(player => ({
      personId: player.person.id,
      fullName: player.person.fullName,
      jerseyNumber: player.jerseyNumber || '?',
      position: player.position.abbreviation || '?'
    }));

    res.json({
      message: `Stats for team ID ${teamId}`,
      stats: teamData,
      roster: rosterData
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching team stats.');
  }
});

app.get('/player-info/:personId', async (req, res) => {
  const personId = req.params.personId;

  try {
    // Fetch player information
    const playerInfo = await mlbStats.getPerson({ pathParams: { personId: personId } });
    const playerInfoParsed = (await playerInfo.json()).people[0];

    // return 404 if player not found
    if (!playerInfo) {
      return res.status(404).send("Player not found.");
    }

    // Extract player data
    const playerData = {
      fullName: playerInfoParsed.fullName,
      nickname: playerInfoParsed.nickName || playerInfoParsed.useName || playerInfoParsed.firstName,
      birthDate: playerInfoParsed.birthDate,
      birthPlace: playerInfoParsed.birthCity + ', ' + playerInfoParsed.birthCountry,
      height: playerInfoParsed.height,
      weight: playerInfoParsed.weight,
      age: playerInfoParsed.currentAge,
      position: playerInfoParsed.primaryPosition.abbreviation,
      batSide: playerInfoParsed.batSide.code,
      pitchHand: playerInfoParsed.pitchHand.code,
      number: playerInfoParsed.primaryNumber || '?',
      debutDate: playerInfoParsed.mlbDebutDate,
    }

    res.json(playerData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching player information.');
  }
});

// Serve static files after custom routes
app.use(express.static('src'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
