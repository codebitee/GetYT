const express = require('express');
const ytdl = require('@distube/ytdl-core');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/video-info', async (req, res) => {
    try {
        const videoURL = req.query.url;
        if (!videoURL || !ytdl.validateURL(videoURL)) {
            return res.status(400).json({ error: 'Valid YouTube URL dya.' });
        }

        const info = await ytdl.getInfo(videoURL);
        const thumbnails = info.videoDetails.thumbnails;
        const bestThumbnail = thumbnails[thumbnails.length - 1].url;

        res.json({
            title: info.videoDetails.title,
            thumbnail: bestThumbnail,
            duration: info.videoDetails.lengthSeconds
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Video mahiti load hot nahiye.' });
    }
});

app.get('/api/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        const format = req.query.format || 'mp4';

        if (!videoURL || !ytdl.validateURL(videoURL)) {
            return res.status(400).send('Valid YouTube URL dya.');
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
        console.error(error);
        res.status(500).send('Download madhe adchan ali.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
