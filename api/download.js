export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apan ithe GET ani POST dono requests handle karu
  const url = req.method === 'GET' ? req.query.url : req.body.url;

  if (!url) {
    return res.status(400).json({ error: 'कृपया युट्यूबची लिंक (URL) द्या.' });
  }

  return res.status(200).json({
    success: true,
    message: 'डउलोडसाठी लिंक तयार आहे!',
    receivedUrl: url,
    downloadLink: '#' // Yethe pudhe khara download logic yeil
  });
}
