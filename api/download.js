export default function handler(req, res) {
  // CORS हँडल करण्यासाठी हेHeaders आवश्यक आहेत
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'कृपया युट्यूबची लिंक (URL) द्या.' });
    }

    // सध्यातरी टेस्टिंगसाठी आपण सक्सेस रिस्पॉन्स पाठवत आहोत
    return res.status(200).json({
      success: true,
      message: 'लिंक यशस्वीरित्या मिळाली आहे!',
      receivedUrl: url,
      title: 'उदाहरणादाखल यूट्यूब व्हिडिओ शीर्षक',
      downloads: [
        { quality: '720p', format: 'mp4', url: '#' },
        { quality: '360p', format: 'mp4', url: '#' }
      ]
    });
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
