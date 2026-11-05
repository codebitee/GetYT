const express = require('express');
const ytdl = require('@distube/ytdl-core');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// YouTube Video ID काढण्याचे हेल्पर फंक्शन
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// 1. Reliable Video Info API (Using YouTube Official oEmbed API)
app.get('/api/video-info', async (req, res) => {
    try {
        const videoURL = req.query.url;
        const videoId = getYouTubeID(videoURL);

        if (!videoId) {
            return res.status(400).json({ error: 'Valid YouTube URL द्या.' });
        }

        // YouTube official oEmbed API Call (YouTube cloud IP ला ब्लॉक करत नाही)
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        const response = await fetch(oembedUrl);

        if (!response.ok) {
            throw new Error('Video info failed');
        }

        const data = await response.json();
        
        // High Quality Thumbnail Link
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        res.json({
            title: data.title,
            thumbnail: thumbnailUrl
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Video माहिती लोड करताना अडचण आली.' });
    }
});

// 2. Direct Streaming & Download API
app.get('/api/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        const format = req.query.format || 'mp4';

        if (!videoURL || !ytdl.validateURL(videoURL)) {
            return res.status(400).send('Valid YouTube URL द्या.');
        }

        const info = await ytdl.getInfo(videoURL, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        });
        
        const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');

        if (format === 'mp3') {
            res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
            res.setHeader('Content-Type', 'audio/mpeg');
            ytdl(videoURL, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
        } else {
            res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
            res.setHeader('Content-Type', 'video/mp4');
            ytdl(videoURL, { quality: 'highest' }).pipe(res);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('डाऊनलोडिंग दरम्यान अडचण आली.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
