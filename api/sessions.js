export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.BOOKWHEN_API_KEY;

  try {
    const response = await fetch(
      'https://api.bookwhen.com/v2/events?include=tickets',
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(API_KEY + ':').toString('base64'),
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Bookwhen API error' });
    }

    const data = await response.json();

    // Cache for 2 minutes — sessions don't change that often
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);

  } catch (err) {
    console.error('Bookwhen proxy error:', err);
    return res.status(500).json({ error: 'Failed to fetch sessions' });
  }
}
