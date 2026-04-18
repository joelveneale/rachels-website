export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.BOOKWHEN_API_KEY;
  const headers = {
    'Authorization': 'Basic ' + Buffer.from(API_KEY + ':').toString('base64'),
    'Content-Type': 'application/json',
  };

  try {
    let allEvents = [];
    let allIncluded = [];
    let offset = 0;
    const pageSize = 20;
    const maxPages = 10; // cap at 200 events (~10 weeks)

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

      // Merge included, deduplicate by id
      included.forEach(item => {
        if (!allIncluded.find(i => i.id === item.id)) {
          allIncluded.push(item);
        }
      });

      // No more pages
      if (events.length < pageSize) break;

      offset += pageSize;
    }

    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ data: allEvents, included: allIncluded });

  } catch (err) {
    console.error('Bookwhen proxy error:', err);
    return res.status(500).json({ error: 'Failed to fetch sessions' });
  }
}
