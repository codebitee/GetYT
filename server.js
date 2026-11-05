const express = require('express');
const ytdl = require('@distube/ytdl-core');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Video Data (Thumbnail & Info) Fetching API
app.get('/api/video-info', async (req, res) => {
    try {
        const videoURL = req.query.url;
        if (!videoURL || !ytdl.validateURL(videoURL)) {
            return res.status(400).json({ error: 'Valid YouTube URL द्या.' });
        }

        const info = await ytdl.getInfo(videoURL);
        const formatDetails = ytdl.filterFormats(info.formats, 'videoandaudio');

        res.json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails.slice(-1)[0].url,
            duration: info.videoDetails.lengthSeconds
        });
    } catch (error) {
        res.status(500).json({ error: 'Video माहिती लोड करताना अडचण आली.' });
    }
});

// Direct Download Stream API
app.get('/api/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        const format = req.query.format || 'mp4';

        if (!videoURL || !ytdl.validateURL(videoURL)) {
            return res.status(400).send('Valid YouTube URL द्या.');
        }

        const info = await ytdl.getInfo(videoURL);
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
        res.status(500).send('डाऊनलोडिंग दरम्यान अडचण आली.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
