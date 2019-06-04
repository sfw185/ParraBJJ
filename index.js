const fs = require('fs');
const pug = require('pug');
const axios = require('axios');
const AWS = require('aws-sdk');

const template = pug.compileFile('template.pug');
const { groupByStartDay } = require('./schedule.js');
const { getStartTime: start, getEndTime: end } = require('./time.js');

process.on('unhandledRejection', up => { throw up });

const doTheThing = async () => {
  const url = `https://app.clubworx.com/websites/gracie_parramatta/calendar/data?start=${start()}&end=${end()}`
  const { data } = await axios.get(url, { headers: { Accept: "*/*" }});
  const grouped = groupByStartDay(data);

  const html = template({ data: grouped, pretty: true });
  fs.writeFile('public/index.html', html, () => {
    var s3 = new AWS.S3();
    var params = {
      Body: Buffer.from(html, 'utf8'),
      ContentType: 'text/html',
      Bucket: process.env.S3_BUCKET || 'dev.gracieparra.com',
      Key: 'index.html',
     };

     s3.putObject(params, function(err, data) {
       if (err) console.log(err, err.stack); // an error occurred
       else console.log(data);           // successful response
     });
  });
};

exports.handler = doTheThing;