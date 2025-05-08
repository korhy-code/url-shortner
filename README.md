# Custom URL Shortener

A simple URL shortener web application with analytics tracking. This project provides a backend API to shorten URLs, redirect short URLs to the original long URLs, and track analytics such as clicks, device type, and visitor country. The frontend offers a user-friendly interface to create short URLs and view their analytics.

## Features

- Shorten long URLs to short, unique IDs
- Redirect short URLs to the original URLs
- Track analytics for each short URL:
  - Number of clicks
  - Device type of visitors
  - Visitor country (based on IP geolocation)
- View analytics data in a table on the frontend

## Technologies Used

- Backend: Node.js, Express, body-parser, cors, useragent, node-fetch
- Frontend: HTML, Tailwind CSS, JavaScript (Fetch API)
- Data storage: JSON file (`data/urls.json`)

## Setup Instructions

### Prerequisites

- Node.js and npm installed on your machine

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node server.js
   ```
   The backend server will run on `http://localhost:3000`.

### Frontend Setup

1. Open the `frontend/index.html` file in your web browser.
   - You can open it directly by double-clicking the file or using a live server extension in your code editor.

## Usage

1. Enter a long URL in the input field on the frontend page.
2. Click the "Shorten URL" button.
3. The shortened URL will be displayed. Click it to visit the original URL.
4. Analytics for the short URL (clicks, device, country, timestamp) will be shown below.

## API Endpoints

- `POST /api/shorten`
  - Request body: `{ "longUrl": "https://example.com" }`
  - Response: `{ "shortId": "abc123", "shortUrl": "http://localhost:3000/abc123" }`

- `GET /:shortId`
  - Redirects to the original long URL and tracks analytics.

- `GET /api/analytics/:shortId`
  - Response: Analytics data for the short URL, including clicks and visitor info.

## License

This project is open source and available under the MIT License.
