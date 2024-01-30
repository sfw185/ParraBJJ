const { promises: { writeFile } } = require('fs');
const axios = require('axios');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'us-west-2' });
const { getStartTime: start, getEndTime: end } = require('./time');

const scheduleUrl = `https://app.clubworx.com/websites/gracie-parramatta/calendar/data?start=${start()}&end=${end()}`
console.log(`Fetching schedule from ${scheduleUrl}`);

const groupByStartDay = (schedule) =>
  schedule.reduce((aggregate, current) => {
    const startDate = new Date(current["start"]).toLocaleDateString("en-AU", { weekday: "long", month: "short", day: "numeric" });
    if (!aggregate[startDate]) { aggregate[startDate] = []; }
    fixDates(current);
    aggregate[startDate].push(current);
    return aggregate;
  }, {});

const getScheduleData = async() => {
  const { data } = await axios.get(scheduleUrl, { headers: { Accept: "application/json" }});
  return groupByStartDay(data);
}

const getS3BucketName = () => process.env.S3_BUCKET && (process.env.S3_BUCKET).length > 0 ? process.env.S3_BUCKET : null;

const storeLocal = async (html, filename) => writeFile(`./public/${filename}`, html);

const storeRemote = async (html, filename) => await s3.putObject({
  Body: Buffer.from(html, 'utf8'),
  ContentType: 'text/html',
  Bucket: getS3BucketName(),
  Key: filename
}).promise();

const storeHTML = async (html, filename) => {
  console.log(`Storing ${filename}`);
  return getS3BucketName() ? storeRemote(html, filename) : storeLocal(html, filename);
};

const fixDateFormat = (raw_date) => {
  const date = new Date(raw_date);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  return hours + ':' + minutes + ampm;
}

const fixDates = (someClass) => {
  someClass.start = fixDateFormat(someClass.start);
  someClass.end = fixDateFormat(someClass.end);
};

// Polyfill until node.js on Lambda supports Object.fromEntries
function fromEntries (iterable) {
  return [...iterable].reduce((obj, [key, val]) => {
    obj[key] = val
    return obj
  }, {})
}

const sliceObject = (object, startIndex, count) => {
  return fromEntries(Object.entries(object).slice(startIndex, count));
};

module.exports = { getScheduleData, storeHTML, sliceObject };