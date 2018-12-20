
const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const bluebird = require('bluebird');
const bodyParser = require("body-parser");
var youtubedl = require('youtube-dl');
const ytdl = require('ytdl-core');
const app = express();
require('dotenv').config()
var s3 = new AWS.S3();

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let name;

// app.get('*', function (req, res) {
//     res.header({
//         'Content-Disposition': 'attachment; filename="download.txt"'
//     });
//     fs.createReadStream(name).pipe(res);
// }).listen(6000);


app.post("/api/download", function (req, res) {
    // Will be called when the download starts.
    let url = req.body.url
    console.log(url);
    if (url !== undefined) {
        var video = youtubedl(url, ['--format=18'], { cwd: __dirname });
        video.on('info', async info => {
            console.log('Download started');
            console.log('filename: ' + info._filename);
            console.log('size: ' + info.size);
            const finished = await ytdl(url, { filter: (format) => format.container === 'mp4' })
                .pipe(fs.createWriteStream(`${info.filename}.mp4`));
            name = `${__dirname}/${info._filename}.mp4`
            video.on('end', () => console.log('finished'))
            const test = await sendVideoToS3(info._filename)
        })

    } else
        res.send('Must have valid video selected')
})

const sendVideoToS3 = fileName => {
    fs.readFile(`${__dirname}/${fileName}.mp4`, function (err, data) {
        if (err) { throw err; }
        params = { Bucket: 'mysaved-videos', Key: `mp4`, Body: data };
        s3.putObject(params, function (err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log("Successfully uploaded data to myBucket/myKey");
            }
        });
    });
};



// app.get('api/downloadTest', function (req, res) {
//     res.download(name, 'somevideo.mp4');
// });

app.listen(process.env.PORT || 5000);
console.log('Server up and running...');