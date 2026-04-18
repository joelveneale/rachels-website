export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.BOOKWHEN_API_KEY;
  const headers = {
    'Authorization': 'Basic ' + Buffer.from(API_KEY + ':').toString('base64'),
    'Content-Type': 'application/json',
  };

  // ?page=1 returns just the first page fast for initial render
  const firstPageOnly = req.query.page === '1';

  try {
    let allEvents = [];
    let allIncluded = [];
    let offset = 0;
    const pageSize = 20;
    const maxPages = firstPageOnly ? 1 : 10;

    for (let page = 0; page < maxPages; page++) {
      const url = `https://api.bookwhen.com/v2/events?include=tickets,location&page[size]=${pageSize}&page[offset]=${offset}`;
      const response = await fetch(url, { headers });

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Bookwhen API error' });
      }

      const data = await response.json();
      const events = data.data || [];
      const included = data.included || [];

      allEvents = allEvents.concat(events);
      included.forEach(item => {
        if (!allIncluded.find(i => i.id === item.id)) allIncluded.push(item);
      });

      if (events.length < pageSize) break;
      offset += pageSize;
    }

    const maxAge = firstPageOnly ? 60 : 120;
    res.setHeader('Cache-Control', `s-maxage=${maxAge}, stale-while-revalidate=60`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ data: allEvents, included: allIncluded });

  } catch (err) {
    console.error('Bookwhen proxy error:', err);
    return res.status(500).json({ error: 'Failed to fetch sessions' });
  }
}
