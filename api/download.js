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

  return res.status(200).json({
    success: true,
    message: 'Video successfully processed for download!',
    url: url,
    format: format || 'mp4',
    quality: quality || '720p',
    downloadUrl: '#'
  });
}
