import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import useragent from 'useragent';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const dataFilePath = path.resolve('data/urls.json');

// Load or initialize data
let urlData = {};
if (fs.existsSync(dataFilePath)) {
  const rawData = fs.readFileSync(dataFilePath);
  urlData = JSON.parse(rawData);
} else {
  urlData = {};
}

// Helper to save data
function saveData() {
  fs.writeFileSync(dataFilePath, JSON.stringify(urlData, null, 2));
}

// Helper to generate short ID
function generateShortId(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// POST /api/shorten - create short URL
app.post('/api/shorten', (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: 'Missing longUrl in request body' });
  }

  // Check if URL already shortened
  for (const key in urlData) {
    if (urlData[key].longUrl === longUrl) {
      return res.json({ shortId: key, shortUrl: `${req.protocol}://${req.get('host')}/${key}` });
    }
  }

  // Generate unique shortId
  let shortId;
  do {
    shortId = generateShortId();
  } while (urlData[shortId]);

  urlData[shortId] = {
    longUrl,
    clicks: 0,
    analytics: []
  };

  saveData();

  res.json({ shortId, shortUrl: `${req.protocol}://${req.get('host')}/${shortId}` });
});

// GET /:shortId - redirect and track analytics
app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  const entry = urlData[shortId];
  if (!entry) {
    return res.status(404).send('Short URL not found');
  }

  // Track analytics
  entry.clicks += 1;

  // Get device info from user-agent
  const agent = useragent.parse(req.headers['user-agent']);
  const device = agent.device.toString();

  // Get country from IP using free geolocation API
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let country = 'Unknown';
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (response.ok) {
      const geoData = await response.json();
      if (geoData && geoData.country_name) {
        country = geoData.country_name;
      }
    }
  } catch (error) {
    // ignore errors
  }

  entry.analytics.push({
    timestamp: new Date().toISOString(),
    device,
    country
  });

  saveData();

  res.redirect(entry.longUrl);
});

// GET /api/analytics/:shortId - get analytics data
app.get('/api/analytics/:shortId', (req, res) => {
  const { shortId } = req.params;
  const entry = urlData[shortId];
  if (!entry) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  res.json({
    longUrl: entry.longUrl,
    clicks: entry.clicks,
    analytics: entry.analytics
  });
});

app.listen(PORT, () => {
  console.log(`URL Shortener backend running on port ${PORT}`);
});
