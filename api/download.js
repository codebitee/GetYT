export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = req.method === 'GET' ? req.query.url : req.body.url;

  if (!url) {
    return res.status(400).json({ error: 'Please provide a valid YouTube URL.' });
  }

  // इथे आपण युझरला थेट सेफ डाऊनलोड युआरएलवर रीडायरेक्ट करू शकतो
  // किंवा सेव्हफ्रोम किंवा तत्सम सर्व्हिसचा वापर करू शकतो
  const directDownloadUrl = `https://www.ssyoutube.com/watch?v=${encodeURIComponent(url)}`;

  // थेट त्या लिंकवर रीडायरेक्ट करण्यासाठी:
  res.writeHead(302, { Location: directDownloadUrl });
  res.end();
}
