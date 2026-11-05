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

        // YouTube official oEmbed API Call
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        const response = await fetch(oembedUrl);

        if (!response.ok) {
            throw new Error('Video info failed');
        }

        const data = await response.json();
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        res.json({
            title: data.title,
            thumbnail: thumbnailUrl
        });
    } catch (error) {
        console.error("Info Error:", error);
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

        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');

        const streamOptions = {
            quality: format === 'mp3' ? 'highestaudio' : 'highest',
            filter: format === 'mp3' ? 'audioonly' : 'videoandaudio',
            highWaterMark: 1 << 25
        };

        res.setHeader('Content-Disposition', `attachment; filename="${title}.${format}"`);
        res.setHeader('Content-Type', format === 'mp3' ? 'audio/mpeg' : 'video/mp4');

        ytdl(videoURL, streamOptions).pipe(res);

    } catch (error) {
        console.error("Download Error:", error);
        if (!res.headersSent) {
            res.status(500).send('डाऊनलोडिंग दरम्यान अडचण आली.');
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
