const { promises: { writeFile } } = require('fs');
const axios = require('axios');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'us-west-2' });
const { getStartTime: start, getEndTime: end } = require('./time');

const scheduleUrl = `https://app.clubworx.com/websites/gracie_parramatta/calendar/data?start=${start()}&end=${end()}`

const groupByStartDay = (schedule) =>
  schedule.reduce((aggregate, current) => {
    const startDate = new Date(current["start"]).toLocaleDateString("en-AU", { weekday: 'long' }).split(',')[0];
    if (!aggregate[startDate]) { aggregate[startDate] = []; }
    fixDateFormat(current);
    aggregate[startDate].push(current);
    return aggregate;
  }, {});

const getScheduleData = async() => {
  const { data } = await axios.get(scheduleUrl, { headers: { Accept: "*/*" }});
  return groupByStartDay(data);
}

const getS3BucketName = () => process.env.S3_BUCKET && (process.env.S3_BUCKET).length > 0 ? process.env.S3_BUCKET : null;

const storeLocal = async (html) => writeFile('./public/index.html', html);

const storeRemote = async (html) => await s3.putObject({
  Body: Buffer.from(html, 'utf8'),
  ContentType: 'text/html',
  Bucket: getS3BucketName(),
  Key: 'index.html'
}).promise();

const storeHTML = async (html) => {
  console.log({ html });
  return getS3BucketName() ? storeRemote(html) : storeLocal(html);
};

const fixDateFormat = (someClass) => {
  var date = new Date(someClass["start"]);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  someClass.start = hours + ':' + minutes + ampm;
};

module.exports = { getScheduleData, storeHTML };