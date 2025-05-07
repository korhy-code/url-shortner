const form = document.getElementById('shorten-form');
const longUrlInput = document.getElementById('longUrl');
const resultDiv = document.getElementById('result');
const shortUrlAnchor = document.getElementById('shortUrl');
const analyticsDiv = document.getElementById('analytics');
const clicksSpan = document.getElementById('clicks');
const analyticsBody = document.getElementById('analytics-body');

const backendBaseUrl = 'http://localhost:3000';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const longUrl = longUrlInput.value.trim();
  if (!longUrl) return;

  try {
    const response = await fetch(`${backendBaseUrl}/api/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ longUrl }),
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
      return;
    }
    shortUrlAnchor.href = data.shortUrl;
    shortUrlAnchor.textContent = data.shortUrl;
    resultDiv.classList.remove('hidden');

    // Fetch analytics
    fetchAnalytics(data.shortId);
  } catch (error) {
    alert('Error shortening URL');
  }
});

async function fetchAnalytics(shortId) {
  try {
    const response = await fetch(`${backendBaseUrl}/api/analytics/${shortId}`);
    const data = await response.json();
    if (data.error) {
      analyticsDiv.classList.add('hidden');
      return;
    }
    clicksSpan.textContent = data.clicks;
    analyticsBody.innerHTML = '';
    data.analytics.forEach((entry) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="border border-gray-300 px-2 py-1">${new Date(entry.timestamp).toLocaleString()}</td>
        <td class="border border-gray-300 px-2 py-1">${entry.device}</td>
        <td class="border border-gray-300 px-2 py-1">${entry.country}</td>
      `;
      analyticsBody.appendChild(tr);
    });
    analyticsDiv.classList.remove('hidden');
  } catch (error) {
    analyticsDiv.classList.add('hidden');
  }
}
