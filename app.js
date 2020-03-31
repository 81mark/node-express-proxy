require('dotenv').config();
const cors = require('cors');
const express = require('express');
const axios = require('axios');
// Rate Limiter if required
// const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 4000;

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

// Limit Setup
// const limiter = rateLimit({
// 	windowMs: 100, // 100ms
// 	max: 2 // limit each IP to 2 requests per windowMs
// });

// Set up cors before routes!
app.use(cors());

// Apply limit to all requests, NOT used for now.
// app.use(limiter);

// Test route, visit localhost:4000 to confirm it's working!
app.get('/', (req, res) => res.send('<h1>Proxy Server is up!</h1>'));

// Get url and query from our client side and then make request below
app.get('/api/v1/profile-search', async (req, res) => {
	try {
		// eg. http://localhost:4000/api/v1/profile-search?q=
		// or server address /api/v1/profile-search?q=
		const searchString = `${req.query.q}`;

		const results = await axios.get(
			`https://api.github.com/users/${searchString}?client_id=${process.env.CID}&client_secret=${process.env.CS}`
		);
		const profile = await results.data;

		return res.json({
			success: true,
			profile
		});
	} catch (err) {
		return res.json({
			success: false,
			message: `Error with status of ${err.response.status}`
		});
	}
});

app.get('/api/v1/repo-search', async (req, res) => {
	try {
		// eg. http://localhost:4000/api/v1/repo-search?q=
		const searchString = `${req.query.q}`;

		const results = await axios.get(
			`https://api.github.com/users/${searchString}/repos?per_page=${process.env.RC}&sort=${process.env.RS}&client_id=${process.env.CID}&client_secret=${process.env.CS}`
		);
		const repos = await results.data;

		return res.json({
			success: true,
			repos
		});
	} catch (err) {
		return res.json({
			success: false,
			message: `Error with status of ${err.response.status}`
		});
	}
});

app.listen(port, () => console.log(`Proxy Server listening on port ${port}!`));
