export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = req.method === 'GET' ? req.query.url : req.body.url;
  const format = req.method === 'GET' ? req.query.format : req.body.format;
  const quality = req.method === 'GET' ? req.query.quality : req.body.quality;

  if (!url) {
    return res.status(400).json({ error: 'Please provide a valid YouTube URL.' });
  }

  // YouTube URL madhun Video ID kadhne
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('watch?v=')) {
    videoId = url.split('watch?v=')[1]?.split('&')[0];
  }

  if (!videoId) {
    return res.status(400).json({ error: 'Invalid YouTube URL format.' });
  }

  // User ne select kelelya format ani quality nusar download link tayar karne
  // Apan ithe ssyoutube kiwa y2mate sarkhya safe redirect servicecha vapar karu शकतो
  let directDownloadUrl = `https://www.ssyoutube.com/watch?v=${videoId}`;

  // Direct tyach page varun userla download sathi redirect/open karne
  res.writeHead(302, { Location: directDownloadUrl });
  res.end();
}
